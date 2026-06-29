import logging
from typing import Dict, Any, List
from datetime import datetime, timezone
from app.database import db
import json
from ai_workflow.services.llm_service import llm_service
from ai_workflow.services.embedding_service import embedding_service
from ai_workflow.schemas.analysis import AIInsightsOutput
from ai_workflow.prompts.analysis_prompts import ANALYSIS_SYSTEM_PROMPT

logger = logging.getLogger("TableTalk.AnalysisAgent")

class PatternAnalysisAgent:
    async def generate_restaurant_insights(self, business_id: str, mode: str = "all") -> Dict[str, Any]:
        """Runs Agent 3 (Pattern Finder) and Agent 4 (Action Recommendations) in unison using RAG."""
        logger.info(f"Firing Analysis Agents for Business {business_id} in Mode: {mode}")
        
        now = datetime.now(timezone.utc)
        from datetime import timedelta
        if mode == "daily":
            window_start = now - timedelta(hours=24)
        elif mode == "weekly":
            window_start = now - timedelta(days=7)
        elif mode in ["monthly", "unified"]:
            window_start = now - timedelta(days=30)
        else:
            window_start = None

        query = {"business_id": business_id}
        if window_start:
            query["timestamp"] = {"$gte": window_start}

        # 1. Fetch reviews for this business in the window
        new_reviews = await db.find_many("reviews", query, limit=1000)
        
        if not new_reviews:
            logger.warning(f"No reviews found to analyze for {business_id} in mode {mode}")
            return {
                "business_id": business_id,
                "mode": mode,
                "generated_date": datetime.now(timezone.utc),
                "health_trend": [],
                "sentiment": {"positive": 0, "neutral": 0, "negative": 0},
                "themes": {"praised": [], "complaints": [], "temporal_trends": ""},
                "health_score": 0,
                "action_items": []
            }
                    
        # RAG Clustering to extract exemplars for the specific time window
        if len(new_reviews) > 10:
            logger.info(f"Clustering {len(new_reviews)} reviews to extract 10 diverse exemplars for {mode} mode...")
            
            # Extract pre-stored embeddings
            embeddings = []
            texts_to_embed = []
            indices_to_embed = []
            for idx, r in enumerate(new_reviews):
                if "embedding" in r and isinstance(r["embedding"], list) and len(r["embedding"]) > 0:
                    embeddings.append(r["embedding"])
                else:
                    embeddings.append([]) # placeholder
                    texts_to_embed.append(r.get("text", "No text"))
                    indices_to_embed.append(idx)
                    
            # Generate any missing embeddings on the fly (e.g. for old data)
            if texts_to_embed:
                missing_embeddings = await embedding_service.generate_embeddings(texts_to_embed)
                if missing_embeddings:
                    for i, idx in enumerate(indices_to_embed):
                        embeddings[idx] = missing_embeddings[i]
                        new_reviews[idx]["embedding"] = missing_embeddings[i]
            
            # Filter out any that completely failed to embed
            valid_reviews = []
            valid_embeddings = []
            for r, emb in zip(new_reviews, embeddings):
                if emb and len(emb) > 0:
                    valid_reviews.append(r)
                    valid_embeddings.append(emb)
            
            if valid_embeddings:
                n_clusters = min(10, len(valid_reviews))
                new_reviews = embedding_service.extract_exemplars(valid_reviews, valid_embeddings, max_clusters=n_clusters)
            else:
                new_reviews = sorted(new_reviews, key=lambda x: x.get("timestamp", ""), reverse=True)[:10]

        logger.info(f"Processing {len(new_reviews)} exemplar reviews to generate {mode} insights for {business_id}...")

        # Fetch Historical Baseline (the 'all' mode report)
        baseline_report = None
        if mode != "all":
            all_insights = await db.get_collection("insights")
            baseline_insights = [i for i in all_insights if i.get("business_id") == business_id and i.get("mode") == "all"]
            if baseline_insights:
                baseline_report = sorted(baseline_insights, key=lambda x: x.get("generated_date", ""), reverse=True)[0]

        # Base fallback logic in case LLM fails
        total = len(new_reviews)
        ratings = [r["rating"] for r in new_reviews]
        avg_rating = sum(ratings) / total if total > 0 else 0
        health_score = int(avg_rating * 20)
        
        fallback_action_items = [
            {"priority": "High", "category": "operations", "title": "Audit Service Paths", "description": "Investigate table turnaround times.", "citations": []},
            {"priority": "Medium", "category": "marketing", "title": "Highlight Signature Dish", "description": "Promote highest rated items on social media.", "citations": []}
        ]

        fallback_insights = AIInsightsOutput(
            health_trend_data=[
                {"week": "W7", "score": 82}, {"week": "Current", "score": health_score}
            ],
            sentiment_data={"positive": 70, "neutral": 20, "negative": 10},
            themes={"praised": ["Food"], "complaints": ["Wait time"], "temporal_trends": "Busy on weekends"},
            health_score=health_score,
            action_items=fallback_action_items,
            seo_insights={"descriptive_text": "Unable to generate dynamic SEO analysis due to low review volume or API error.", "trending_keywords": []}
        )

        current_time = datetime.now(timezone.utc)

        prompt = f"Analyze for Business ID: {business_id}\n"
        prompt += f"Time Window: {mode.upper()}\n\n"
        
        if baseline_report:
            prompt += f"--- HISTORICAL BASELINE ---\n"
            prompt += json.dumps({
                "health_score": baseline_report.get("health_score"),
                "sentiment": baseline_report.get("sentiment"),
                "themes": baseline_report.get("themes")
            }, indent=2) + "\n\n"
            
        prompt += f"--- {mode.upper()} REVIEWS ({len(new_reviews)} exemplars) ---\n"
        for r in new_reviews:
            prompt += f"- ID: {r.get('id', str(r.get('_id', '')))}, Timestamp: {r.get('timestamp')}, Rating: {r.get('rating')}, Text: {r.get('text', 'No text')}, Items: {r.get('ordered_items', [])}\n"

        structured_insights = await llm_service.generate_structured_output(
            prompt=prompt,
            system_instruction=ANALYSIS_SYSTEM_PROMPT,
            response_schema=AIInsightsOutput,
            fallback_data=fallback_insights
        )

        insights_record = {
            "business_id": business_id,
            "mode": mode,
            "generated_date": current_time,
            "health_trend": [h.model_dump() for h in structured_insights.health_trend_data],
            "sentiment": structured_insights.sentiment_data.model_dump(),
            "themes": structured_insights.themes.model_dump(),
            "health_score": structured_insights.health_score,
            "action_items": [a.model_dump() for a in structured_insights.action_items]
        }

        # Save freshly compiled insights record
        await db.insert_one("insights", insights_record)
        
        # Only update business health score globally if it's "all" time
        if mode == "all":
            await db.update_one(
                "businesses",
                {"id": business_id},
                {"$set": {"health_score": health_score}}
            )

        logger.info(f"Successfully generated analytical insights for {business_id} ({mode})")
        return insights_record

# Global agent instance
analysis_agent = PatternAnalysisAgent()
