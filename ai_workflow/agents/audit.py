import logging
from typing import Dict, Any, List
from app.database import db
from ai_workflow.services.llm_service import llm_service
from ai_workflow.prompts.audit_prompts import AUDIT_SYSTEM_PROMPT
from ai_workflow.schemas.audit import StructuredAuditOutput, ComplaintItem

logger = logging.getLogger("TableTalk.AuditAgent")

class OnboardingAuditAgent:
    async def run_audit_flow(self, restaurant_id: str, maps_url: str) -> Dict[str, Any]:
        """Scrapes initial reviews and processes them into themes & health index."""
        logger.info(f"Dispatched Audit Agent #1 for Restaurant ID: {restaurant_id}")
        
        # 1. Simulate review scraping (Google Maps API / Outscraper mockup)
        raw_reviews = self._scrape_google_reviews(restaurant_id, maps_url)
        
        # Save scraped reviews to DB
        saved_reviews = []
        for r in raw_reviews:
            saved = await db.insert_one("reviews", r)
            saved_reviews.append(saved)
            
        logger.info(f"Scraped & saved {len(saved_reviews)} historical reviews for Restaurant {restaurant_id}")
        
        # 2. Extract themes & calculate health score via LLM (or robust template)
        reviews_summary_text = "\n".join([f"Rating: {r['rating']} - Text: {r['text']}" for r in raw_reviews])
        
        fallback_data = StructuredAuditOutput(
            health_score=84,
            praised=["Mutton Biryani", "Butter Naan", "Tandoori Chicken", "Warm Hospitality"],
            complaints=[
                ComplaintItem(issue="Dry seekh kebabs on busy nights", impact="Medium"),
                ComplaintItem(issue="Slow beverage delivery during dinner peak hours", impact="High")
            ],
            action_items=[
                "Feature Mutton Biryani as your signature recommendation on Google Maps posts.",
                "Review waiter pathing from beverage station to tables 5-8 during rush hours.",
                "Add pre-skewering prep steps to avoid dry seekh kebab complaints."
            ]
        )
        
        prompt = f"Please analyze these historical reviews for restaurant with maps_url {maps_url}:\n\n{reviews_summary_text}"
        
        # Call Google Gemini with Structured Outputs
        structured_audit = await llm_service.generate_structured_output(
            prompt=prompt,
            system_instruction=AUDIT_SYSTEM_PROMPT,
            response_schema=StructuredAuditOutput,
            fallback_data=fallback_data
        )
        
        # Draft dynamic replies to imported reviews that are unanswered
        for idx, rev in enumerate(saved_reviews):
            items = rev.get("ordered_items", [])
            item_ref = f"our {', '.join(items)}" if items else "our food and service"
            if rev["rating"] <= 3:
                draft = f"Thank you for your feedback, {rev.get('diner_name', 'Guest')}. We sincerely apologize for the delay regarding your {item_ref}. We have addressed this with our kitchen team and hope to welcome you back to offer a much smoother service."
                await db.update_one("reviews", {"id": rev["id"]}, {"$set": {"ai_response_draft": draft}})
            else:
                draft = f"Hi {rev.get('diner_name', 'Guest')}! We are thrilled to hear you loved our {item_ref}! Our team takes great pride in crafting these fresh daily. Looking forward to your next visit!"
                await db.update_one("reviews", {"id": rev["id"]}, {"$set": {"ai_response_draft": draft}})

        # 3. Create global insights record
        insights_data = {
            "restaurant_id": restaurant_id,
            "generated_date": "2026-05-25T18:00:00Z",
            "themes": {
                "praised": structured_audit.praised,
                "complaints": [c.issue for c in structured_audit.complaints]
            },
            "health_score": structured_audit.health_score,
            "action_items": structured_audit.action_items
        }
        
        await db.insert_one("insights", insights_data)
        
        # 4. Mark restaurant audit as complete & update average score
        await db.update_one(
            "restaurants",
            {"id": restaurant_id},
            {"$set": {"health_score": structured_audit.health_score, "audit_completed": True}}
        )
        
        logger.info(f"Audit Agent #1 successfully compiled profile for {restaurant_id}.")
        return insights_data

    def _scrape_google_reviews(self, restaurant_id: str, maps_url: str) -> List[Dict[str, Any]]:
        """Simulates crawling Google Maps local search for reviews."""
        return [
            {
                "restaurant_id": restaurant_id,
                "source": "google",
                "rating": 5,
                "text": "Best butter chicken in Bandra! Hands down the most tender pieces. We also got the butter naan which was fresh and crisp.",
                "ordered_items": ["Butter Chicken & Naan"],
                "visitor_type": "returning",
                "diner_name": "Rohan Sharma",
                "timestamp": "2026-05-20T19:30:00Z"
            },
            {
                "restaurant_id": restaurant_id,
                "source": "google",
                "rating": 5,
                "text": "Mutton Biryani has an absolute rich aroma! Perfect spices and melt in mouth meat pieces. Clean place, nice staff.",
                "ordered_items": ["Mutton Biryani"],
                "visitor_type": "returning",
                "diner_name": "Pooja Mehta",
                "timestamp": "2026-05-18T21:00:00Z"
            },
            {
                "restaurant_id": restaurant_id,
                "source": "google",
                "rating": 2,
                "text": "Starters were dry. Seekh kebab was literally like chewing leather. Also they forgot our mocktails and brought it after we finished food. Very disappointing service on Friday.",
                "ordered_items": ["Tandoori Mixed Grill"],
                "visitor_type": "first-time",
                "diner_name": "Karan Malhotra",
                "timestamp": "2026-05-15T22:15:00Z"
            },
            {
                "restaurant_id": restaurant_id,
                "source": "google",
                "rating": 4,
                "text": "Decent place, family loved the food. Paneer tikka was extremely soft and well seasoned. Recommend their lassi too. Service was okay.",
                "ordered_items": ["Paneer Tikka Masala"],
                "visitor_type": "first-time",
                "diner_name": "Ananya Sen",
                "timestamp": "2026-05-10T14:00:00Z"
            }
        ]

# Global agent instance
audit_agent = OnboardingAuditAgent()
