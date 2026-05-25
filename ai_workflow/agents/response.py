import logging
from typing import Dict, Any
from app.database import db
from ai_workflow.services.llm_service import llm_service
from ai_workflow.prompts.response_prompts import RESPONSE_SYSTEM_PROMPT
from ai_workflow.schemas.response import StructuredResponseOutput

logger = logging.getLogger("TableTalk.ResponseAgent")

class GoogleReviewResponseAgent:
    async def draft_response(self, review_id: str, review_data: Dict[str, Any]) -> str:
        """Agent 5: Evaluates review sentiment and formulates highly tailored response drafts."""
        rating = review_data.get("rating", 5)
        text = review_data.get("text", "")
        name = review_data.get("diner_name", "Valued Guest")
        items = review_data.get("ordered_items", [])
        
        logger.info(f"Response Agent #5 drafting Google reply for review {review_id}. Rating: {rating} stars.")

        item_str = f"our {', '.join(items)}" if items else "our food and service"

        # Heuristic fallbacks
        if rating >= 4:
            fallback_reply = (
                f"Hi {name}! Thank you so much for the wonderful review. "
                f"We are absolutely thrilled that you enjoyed {item_str}! "
                f"Our kitchen staff takes immense pride in sourcing the freshest local ingredients "
                f"and preparing everything to order. We look forward to welcoming you back for another "
                f"stellar meal very soon!"
            )
        else:
            fallback_reply = (
                f"Hello {name}, thank you for taking the time to share your feedback. "
                f"We are sincerely sorry to hear that {item_str} fell short of your expectations today. "
                f"We strive to give every guest a premium experience, and we have shared your comments "
                f"directly with our head chef and floor captain to rectify this speed/quality issue immediately. "
                f"We hope you will give us another opportunity to serve you and show you our true standard."
            )

        fallback_output = StructuredResponseOutput(
            sentiment="positive" if rating >= 4 else "negative",
            drafted_reply=fallback_reply
        )

        prompt = (
            f"Review Star Rating: {rating}\n"
            f"Review Text: {text}\n"
            f"Diner Name: {name}\n"
            f"Ordered Items: {', '.join(items)}\n"
        )

        # Call Gemini structured output
        structured_response = await llm_service.generate_structured_output(
            prompt=prompt,
            system_instruction=RESPONSE_SYSTEM_PROMPT,
            response_schema=StructuredResponseOutput,
            fallback_data=fallback_output
        )

        draft = structured_response.drafted_reply

        # Update the review document with the AI-drafted reply
        await db.update_one(
            "reviews",
            {"id": review_id},
            {"$set": {"ai_response_draft": draft}}
        )

        return draft

# Global agent instance
response_agent = GoogleReviewResponseAgent()
