import asyncio
from datetime import datetime, timezone
import logging
from app.database import db

logger = logging.getLogger(__name__)

async def process_campaign(campaign):
    logger.info(f"Executing campaign {campaign['id']} for segment {campaign['target_segment']}")
    
    # 1. Fetch business
    business_id = campaign["business_id"]
    
    # 2. In a real system, we would query the customers collection or reviews 
    # to find users matching the segment.
    # For now, we simulate SMS sending.
    
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


async def campaign_cron_loop():
    logger.info("Started campaign cron loop")
    while True:
        try:
            campaigns = await db.get_collection("campaigns")
            now = datetime.now(timezone.utc)
            
            for c in campaigns:
                if c.get("status") == "pending" and c.get("execute_at", "") <= now:
                    await process_campaign(c)
                    
        except Exception as e:
            logger.error(f"Error in campaign cron loop: {e}")
            
        # Run every 10 seconds for testing (production would be 60s)
        await asyncio.sleep(10)

def start_cron_jobs():
    asyncio.create_task(campaign_cron_loop())
