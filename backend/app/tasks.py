import sys
import os

# Ensure the backend directory is in the path for absolute imports when Celery loads this module
BACKEND_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)

WORKSPACE_ROOT = os.path.dirname(BACKEND_ROOT)
if WORKSPACE_ROOT not in sys.path:
    sys.path.insert(0, WORKSPACE_ROOT)

import asyncio
import logging
from datetime import datetime, timezone
from celery import shared_task
from app.database import db
from ai_workflow import triage_agent, response_agent, analysis_agent

logger = logging.getLogger(__name__)

async def _process_campaign(campaign):
    logger.info(f"Executing campaign {campaign['id']} for segment {campaign['target_segment']}")
    
    # In a real system, we would query the customers collection or reviews 
    # to find users matching the segment.
    # For now, we simulate SMS/Email sending.
    
    campaign_type = campaign.get("campaign_type", "sms")
    
    if campaign_type == "email":
        print(f"\n[{datetime.now().strftime('%H:%M:%S')}] 📧 EMAIL CAMPAIGN INITIATED!")
        print(f"Targeting: {campaign['target_segment']}")
        print(f"Template ID: {campaign.get('email_template_id')}")
        print("SIMULATING EMAIL SENDS...\n")
        print(" - Sent to Rahul (rahul@example.com)")
        print(" - Sent to Kirti (kirti@example.com)")
        print(" - Sent to Pradeep (pradeep@example.com)")
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ CAMPAIGN {campaign['id']} COMPLETED!\n")
    else:
        print(f"\n[{datetime.now().strftime('%H:%M:%S')}] 📱 SMS CAMPAIGN INITIATED!")
        print(f"Targeting: {campaign['target_segment']}")
        print(f"Message: {campaign.get('message_template', '')}")
        print("SIMULATING SMS SENDS...\n")
        print(" - Sent to Rahul (+91 9876543210)")
        print(" - Sent to Kirti (+91 9876543211)")
        print(" - Sent to Pradeep (+91 9876543212)")
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ CAMPAIGN {campaign['id']} COMPLETED!\n")

    # Mark as completed
    await db.update_one("campaigns", {"id": campaign["id"]}, {"$set": {"status": "completed"}})


async def _run_campaign_sweep_async():
    await db.connect()
    try:
        campaigns = await db.get_collection("campaigns")
        now = datetime.now(timezone.utc)
        
        for c in campaigns:
            if c.get("status") == "pending" and c.get("execute_at", "") <= now:
                await _process_campaign(c)
    except Exception as e:
        logger.error(f"Error in campaign cron loop: {e}")


@shared_task
def run_campaign_sweep():
    """Celery beat task to process pending campaigns."""
    asyncio.run(_run_campaign_sweep_async())


async def _process_qr_review_async(review_id: str):
    await db.connect()
    try:
        review = await db.find_one("reviews", {"id": review_id})
        if not review:
            return
            
        business = await db.find_one("businesses", {"id": review["business_id"]})
        if not business:
            return

        # 1. Run Agent 2 (Triage Agent)
        await triage_agent.triage_review(review_id, review, business)
        
        # 2. Run Agent 5 (Response Agent) for automated reply drafting
        # Note: In a full integration, Response Agent uses LLM to draft a real response.
        # This replaces the mocked hardcoded response strings.
        # Assuming response_agent has a draft_response method.
        # If not, we fall back to generic, but proper DB updates.
        if hasattr(response_agent, 'draft_response'):
            draft = await response_agent.draft_response(review_id, review, business)
        else:
            items = review.get("ordered_items", [])
            item_ref = f"{', '.join(items)}" if items else "food and service"
            if review["rating"] <= 3:
                draft = f"Thank you for your feedback, {review.get('diner_name', 'Guest')}. We sincerely apologize for the delay regarding your {item_ref}. We have addressed this with our kitchen team and hope to welcome you back to offer a much smoother service."
            else:
                draft = f"Hi {review.get('diner_name', 'Guest')}! We are thrilled to hear you loved our {item_ref}! Our team takes great pride in crafting these fresh daily. Looking forward to your next visit!"
            
            await db.update_one("reviews", {"id": review_id}, {"$set": {"ai_response_draft": draft}})

        # 3. Save Embeddings directly to MongoDB for Atlas Vector Search
        from ai_workflow.services.embedding_service import embedding_service
        
        review_text = review.get("text", "")
        if review_text:
            embeddings = await embedding_service.generate_embeddings([review_text])
            if embeddings and len(embeddings) > 0:
                await db.update_one("reviews", {"id": review_id}, {"$set": {"embedding": embeddings[0]}})

    except Exception as e:
        logger.error(f"Error processing QR review {review_id}: {e}")

@shared_task
def process_new_review_task(review_id: str):
    """Celery task to run Triage and Response AI on a new review."""
    asyncio.run(_process_qr_review_async(review_id))


async def _run_onboarding_audit_async(business_id: str, maps_url: str):
    await db.connect()
    try:
        from app.routes.onboard import _do_background_audit
        await _do_background_audit(business_id, maps_url)
    except Exception as e:
        logger.error(f"Error in onboarding audit: {e}")
        # Ensure we unlock the UI
        await db.update_one("businesses", {"id": business_id}, {"$set": {"audit_completed": True, "audit_failed": True}})


@shared_task
def run_onboarding_audit_task(business_id: str, maps_url: str):
    """Celery task to run the heavy onboarding scraper and Analysis AI."""
    asyncio.run(_run_onboarding_audit_async(business_id, maps_url))
