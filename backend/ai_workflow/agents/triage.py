import logging
from typing import Dict, Any
from datetime import datetime, timezone
from app.database import db
from ai_workflow.services.llm_service import llm_service
from ai_workflow.prompts.triage_prompts import TRIAGE_SYSTEM_PROMPT
from ai_workflow.schemas.triage import StructuredTriageOutput

logger = logging.getLogger("TableTalk.TriageAgent")

class ReviewTriageAgent:
    async def triage_review(self, review_id: str, review_data: Dict[str, Any], business_obj: Dict[str, Any] = None) -> Dict[str, Any]:
        """Classifies incoming reviews and orchestrates responses."""
        rating = review_data.get("rating", 5)
        text = review_data.get("text", "")
        items = review_data.get("ordered_items", [])
        phone = review_data.get("diner_phone", "")
        name = review_data.get("diner_name", "Valued Guest")
        business_id = review_data.get("business_id")
        visitor_type = review_data.get("visitor_type", "first-time")
        
        # Incentive Configurations
        has_incentives = business_obj.get("has_incentives", False) if business_obj else False
        all_coupons = await db.get_collection("coupons")
        coupons = [c for c in all_coupons if c.get("business_id") == business_id]
        
        # Determine sentiment for targeting
        sentiment = "positive" if rating >= 4 else "negative"
        
        # Filter eligible coupons by target and quantity
        eligible_coupons = []
        for i, c in enumerate(coupons):
            q = c.get("quantity")
            t = c.get("target_sentiment", "all")
            try:
                has_stock = (q is None or str(q).strip() == "" or int(q) > 0)
            except ValueError:
                has_stock = True
                
            matches_target = (t == "all" or t == sentiment)
            if has_stock and matches_target:
                eligible_coupons.append((i, c))
                
        import random
        chosen_coupon_data = random.choice(eligible_coupons) if eligible_coupons else None
        rest_coupon_code = chosen_coupon_data[1].get("coupon_code", "DELICIOUS15") if chosen_coupon_data else "DELICIOUS15"

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
            reward_code=rest_coupon_code if has_incentives else None,
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

        # CRM Update & Milestone Logic
        give_reward = False
        if phone:
            existing_cust = await db.find_one("customers", {"phone": phone, "business_id": business_id})
            
            inc_good = 1 if rating >= 4 else 0
            inc_bad = 1 if rating <= 3 else 0
            
            if existing_cust:
                new_good = existing_cust.get("good_reviews_count", 0) + inc_good
                new_bad = existing_cust.get("bad_reviews_count", 0) + inc_bad
                new_total = existing_cust.get("total_reviews_count", 0) + 1
                
                await db.update_one(
                    "customers",
                    {"phone": phone, "business_id": business_id},
                    {
                        "$set": {"segment": structured_triage.segment, "last_visit": datetime.now(timezone.utc).isoformat()},
                        "$inc": {
                            "visit_count": 1,
                            "good_reviews_count": inc_good,
                            "bad_reviews_count": inc_bad,
                            "total_reviews_count": 1
                        }
                    }
                )
                
                # Milestone triggers
                if new_good > 0 and new_good % 3 == 0:
                    give_reward = True
                elif new_bad > 0 and new_bad % 2 == 0:
                    give_reward = True
                    
            else:
                new_cust = {
                    "phone": phone,
                    "business_id": business_id,
                    "visit_count": 1,
                    "last_visit": datetime.now(timezone.utc).isoformat(),
                    "segment": structured_triage.segment,
                    "good_reviews_count": inc_good,
                    "bad_reviews_count": inc_bad,
                    "total_reviews_count": 1
                }
                await db.insert_one("customers", new_cust)
                give_reward = True  # First review gets a reward!
        else:
            # Without phone number to track, default to giving reward for first time only visually
            give_reward = True if visitor_type == "first-time" else False

        # Apply final reward decision
        final_reward_code = rest_coupon_code if (give_reward and has_incentives and chosen_coupon_data) else None

        # Decrement stock if dispatched
        if final_reward_code and chosen_coupon_data:
            c_obj = chosen_coupon_data[1]
            q = c_obj.get("quantity")
            coupon_code = c_obj.get("coupon_code")
            try:
                if q is not None and str(q).strip() != "" and int(q) > 0:
                    await db.update_one(
                        "coupons",
                        {"business_id": business_id, "coupon_code": coupon_code},
                        {"$inc": {"quantity": -1}}
                    )
            except ValueError:
                pass

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
            "reward_code": final_reward_code,
            "alert_owner": structured_triage.alert_owner,
            "apology_draft": structured_triage.apology_draft
        }

# Global agent instance
triage_agent = ReviewTriageAgent()
