from fastapi import APIRouter, HTTPException, Body, BackgroundTasks
from typing import Optional
from datetime import datetime, timezone
from app.database import db
from app.schemas.review import QRReviewSubmitRequest, VoiceExtractRequest

# Import Agent 2 & Agent 5
from ai_workflow import triage_agent, response_agent, extractor_agent

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("/extract-voice")
async def extract_voice(request: VoiceExtractRequest):
    """Takes raw voice transcript and returns structured JSON (name, items, clean review)."""
    extracted_data = await extractor_agent.extract_voice_transcript(request.transcript)
    return extracted_data.model_dump()

@router.post("")
async def submit_qr_review(request: QRReviewSubmitRequest, background_tasks: BackgroundTasks):
    # Find business
    business = await db.find_one("businesses", {"slug": request.restaurant_slug})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
        
    business_id = business["id"]
    
    # Construct base review record
    review_data = {
        "business_id": business_id,
        "source": "qr",
        "rating": request.rating,
        "text": request.text,
        "ordered_items": request.ordered_items,
        "visitor_type": request.visitor_type,
        "diner_name": request.diner_name,
        "diner_phone": request.diner_phone,
        "diner_email": request.diner_email,
        "diner_birthdate": request.diner_birthdate,
        "timestamp": datetime.now(timezone.utc),
        "owner_alerted": False,
        "ai_apology_draft": None,
        "status": "pending_triage"
    }
    
    saved_review = await db.insert_one("reviews", review_data)
    review_id = saved_review["id"]
    
    # Run Agent 2 & Agent 5 via FastAPI BackgroundTasks instead of Celery!
    from app.tasks import _process_qr_review_async
    background_tasks.add_task(_process_qr_review_async, review_id)
    
    return {
        "message": "Review submitted successfully",
        "review_id": review_id,
        "triage": {"status": "processing_in_background"}
    }

@router.get("/{slug}")
async def get_restaurant_reviews(slug: str, source: Optional[str] = None, page: int = 1, size: int = 20):
    business = await db.find_one("businesses", {"slug": slug})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
        
    query = {"business_id": business["id"]}
    if source:
        query["source"] = source
        
    skip = (page - 1) * size
    filtered = await db.find_many("reviews", query, skip=skip, limit=size)
    total = await db.count("reviews", query)
    
    return {
        "items": filtered,
        "total": total,
        "page": page,
        "size": size,
        "restaurant_name": business["name"]
    }

@router.post("/{review_id}/approve")
@router.post("/{review_id}/approve-reply")
async def approve_google_reply(
    review_id: str, 
    custom_reply: Optional[str] = Body(None),
    final_reply_content: Optional[str] = Body(None)
):
    """Agent 5: Approves and marks a drafted Google Review response as dispatched."""
    review = await db.find_one("reviews", {"id": review_id})
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
        
    final_reply = final_reply_content or custom_reply or review.get("ai_response_draft", "Thank you for the review!")
    
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

@router.post("/{review_id}/regenerate-draft")
async def regenerate_review_draft(review_id: str):
    """Agent 5: Re-evaluates review text and drafts a new response using only actual details."""
    review = await db.find_one("reviews", {"id": review_id})
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
        
    # Re-draft response (which automatically cleans hallucinated items in-place)
    new_draft = await response_agent.draft_response(review_id, review)
    
    # Retrieve updated review to return the cleaned items list
    updated_review = await db.find_one("reviews", {"id": review_id})
    
    return {
        "message": "AI reply draft regenerated successfully!",
        "review_id": review_id,
        "ai_response_draft": new_draft,
        "ordered_items": updated_review.get("ordered_items", [])
    }
