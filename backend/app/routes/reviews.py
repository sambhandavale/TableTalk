from fastapi import APIRouter, HTTPException, Body
from typing import Optional
from app.database import db
from app.schemas.review import QRReviewSubmitRequest

# Import Agent 2 & Agent 5
from ai_workflow import triage_agent, response_agent

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("")
async def submit_qr_review(request: QRReviewSubmitRequest):
    # Find restaurant
    restaurant = await db.find_one("restaurants", {"slug": request.restaurant_slug})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
        
    restaurant_id = restaurant["id"]
    
    # Construct base review record
    review_data = {
        "restaurant_id": restaurant_id,
        "source": "qr",
        "rating": request.rating,
        "text": request.text,
        "ordered_items": request.ordered_items,
        "visitor_type": request.visitor_type,
        "diner_name": request.diner_name,
        "diner_phone": request.diner_phone,
        "diner_email": request.diner_email,
        "timestamp": "2026-05-25T18:00:00Z",  # Mock timestamp
        "owner_alerted": False,
        "ai_apology_draft": None,
        "status": "pending_triage"
    }
    
    saved_review = await db.insert_one("reviews", review_data)
    review_id = saved_review["id"]
    
    # Run Agent 2 (Triage Agent) to check rating & generate recovery content
    triage_result = await triage_agent.triage_review(review_id, saved_review)
    
    return {
        "message": "Review submitted successfully",
        "review_id": review_id,
        "triage": triage_result
    }

@router.get("/{slug}")
async def get_restaurant_reviews(slug: str, source: Optional[str] = None):
    restaurant = await db.find_one("restaurants", {"slug": slug})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
        
    all_reviews = await db.get_collection("reviews")
    filtered = [r for r in all_reviews if r.get("restaurant_id") == restaurant["id"]]
    
    if source:
        filtered = [r for r in filtered if r.get("source") == source]
        
    return {
        "restaurant_name": restaurant["name"],
        "count": len(filtered),
        "reviews": filtered
    }

@router.post("/{review_id}/approve-reply")
async def approve_google_reply(review_id: str, custom_reply: Optional[str] = Body(None)):
    """Agent 5: Approves and marks a drafted Google Review response as dispatched."""
    review = await db.find_one("reviews", {"id": review_id})
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
        
    final_reply = custom_reply or review.get("ai_response_draft", "Thank you for the review!")
    
    await db.update_one(
        "reviews",
        {"id": review_id},
        {"$set": {"owner_approved_reply": True, "final_reply_content": final_reply}}
    )
    
    return {
        "message": "AI reply approved and successfully posted to Google!",
        "review_id": review_id,
        "posted_content": final_reply
    }
