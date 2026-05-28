import logging
from typing import Dict, Any
from app.database import db
from ai_workflow.services.llm_service import llm_service
from ai_workflow.prompts.triage_prompts import TRIAGE_SYSTEM_PROMPT
from ai_workflow.schemas.triage import StructuredTriageOutput

logger = logging.getLogger("TableTalk.TriageAgent")

class ReviewTriageAgent:
    async def triage_review(self, review_id: str, review_data: Dict[str, Any]) -> Dict[str, Any]:
        """Classifies incoming reviews and orchestrates responses."""
        rating = review_data.get("rating", 5)
        text = review_data.get("text", "")
        items = review_data.get("ordered_items", [])
        phone = review_data.get("diner_phone", "")
        name = review_data.get("diner_name", "Valued Guest")
        restaurant_id = review_data.get("restaurant_id")
        visitor_type = review_data.get("visitor_type", "first-time")
        
        logger.info(f"Triage Agent #2 evaluating review {review_id}. Rating: {rating} stars.")

        # Construct raw inputs for LLM Triage evaluation
        prompt = (
            f"Review Star Rating: {rating}\n"
            f"Review Text: {text}\n"
            f"Ordered Items: {', '.join(items)}\n"
            f"Visitor Type: {visitor_type}\n"
            f"Diner Name: {name}\n"
        )

        # Base fallback logic values
        item_ref = f" regarding the {', '.join(items)}" if items else ""
        fallback_apology = (
            f"Dear {name},\n\n"
            f"We are deeply sorry to hear that your experience{item_ref} fell short of expectations. "
            f"We strive for excellence, and we'd love to make this right for you. Please accept a "
            f"complimentary starter on your next visit. Our floor manager has been briefed to make "
            f"sure your next meal is flawless.\n\n"
            f"Warm regards,\n"
            f"The Management Team"
        )

        # Standard heuristics matching fallback
        calculated_segment = "New Customer"
        if visitor_type == "returning":
            calculated_segment = "Happy Regular" if rating >= 4 else "Lost/Unhappy"
        else:
            if rating <= 3:
                calculated_segment = "At-Risk"

        fallback_triage = StructuredTriageOutput(
            segment=calculated_segment,
            route="public" if rating >= 4 else "private_alarm",
            google_redirect=True if rating >= 4 else False,
            reward_code="DELICIOUS15" if rating >= 4 else "SORRY20",
            alert_owner=False if rating >= 4 else True,
            apology_draft=None if rating >= 4 else fallback_apology
        )

        # Process structured output via Gemini
        structured_triage = await llm_service.generate_structured_output(
            prompt=prompt,
            system_instruction=TRIAGE_SYSTEM_PROMPT,
            response_schema=StructuredTriageOutput,
            fallback_data=fallback_triage
        )

        # Update customer cohort / contact database
        if phone:
            existing_cust = await db.find_one("customers", {"phone": phone, "restaurant_id": restaurant_id})
            if existing_cust:
                await db.update_one(
                    "customers",
                    {"phone": phone, "restaurant_id": restaurant_id},
                    {
                        "$set": {"segment": structured_triage.segment, "last_visit": "2026-05-25T18:00:00Z"},
                        "$inc": {"visit_count": 1}
                    }
                )
            else:
                new_cust = {
                    "phone": phone,
                    "restaurant_id": restaurant_id,
                    "visit_count": 1,
                    "last_visit": "2026-05-25T18:00:00Z",
                    "segment": structured_triage.segment
                }
                await db.insert_one("customers", new_cust)

        # Update review record in DB
        update_fields = {
            "status": "triaged_positive" if structured_triage.route == "public" else "triaged_alarm",
            "owner_alerted": structured_triage.alert_owner
        }
        if structured_triage.apology_draft:
            update_fields["ai_apology_draft"] = structured_triage.apology_draft

        await db.update_one("reviews", {"id": review_id}, {"$set": update_fields})

        return {
            "route": structured_triage.route,
            "google_redirect": structured_triage.google_redirect,
            "reward_code": structured_triage.reward_code,
            "alert_owner": structured_triage.alert_owner,
            "apology_draft": structured_triage.apology_draft
        }

# Global agent instance
triage_agent = ReviewTriageAgent()
