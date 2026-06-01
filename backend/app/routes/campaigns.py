from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.database import db
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])

class CampaignCreate(BaseModel):
    business_id: str
    target_segment: str
    campaign_type: str = "sms"
    message_template: Optional[str] = None
    email_template_id: Optional[str] = None
    schedule_type: str
    schedule_time: Optional[str] = None
    schedule_date: Optional[str] = None
    coupon_code: Optional[str] = None

@router.post("")
async def create_campaign(request: CampaignCreate):
    business = await db.find_one("businesses", {"id": request.business_id})
    if not business:
        business = await db.find_one("businesses", {"slug": request.business_id})
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
            
    actual_id = business.get("id")
    
    # Calculate execution time
    execute_at = None
    if request.schedule_type == "now":
        execute_at = datetime.now(timezone.utc).isoformat()
    else:
        # e.g. schedule_date: "2024-07-15", schedule_time: "12:00"
        try:
            dt_str = f"{request.schedule_date}T{request.schedule_time}:00Z"
            execute_at = dt_str
        except Exception:
            execute_at = datetime.now(timezone.utc).isoformat()
            
    campaign_doc = {
        "id": f"camp-{str(uuid.uuid4())[:8]}",
        "business_id": actual_id,
        "target_segment": request.target_segment,
        "campaign_type": request.campaign_type,
        "message_template": request.message_template,
        "email_template_id": request.email_template_id,
        "schedule_type": request.schedule_type,
        "execute_at": execute_at,
        "coupon_code": request.coupon_code,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    saved = await db.insert_one("campaigns", campaign_doc)
    return {"message": "Campaign created", "campaign": saved}

@router.get("/{business_id}")
async def get_campaigns(business_id: str):
    business = await db.find_one("businesses", {"id": business_id})
    if not business:
        business = await db.find_one("businesses", {"slug": business_id})
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
            
    actual_id = business.get("id")
    
    campaigns = []
    all_c = await db.get_collection("campaigns")
    for c in all_c:
        if c.get("business_id") == actual_id:
            campaigns.append(c)
            
    campaigns.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return {"campaigns": campaigns}
