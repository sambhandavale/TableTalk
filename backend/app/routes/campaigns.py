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
        execute_at = datetime.now(timezone.utc)
    else:
        # e.g. schedule_date: "2024-07-15", schedule_time: "12:00"
        try:
            execute_at = datetime.strptime(f"{request.schedule_date}T{request.schedule_time}:00Z", "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
        except Exception:
            execute_at = datetime.now(timezone.utc)
            
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
        "created_at": datetime.now(timezone.utc)
    }
    
    saved = await db.insert_one("campaigns", campaign_doc)
    return {"message": "Campaign created", "campaign": saved}

@router.get("/{business_id}")
async def get_campaigns(business_id: str, page: int = 1, size: int = 20):
    business = await db.find_one("businesses", {"id": business_id})
    if not business:
        business = await db.find_one("businesses", {"slug": business_id})
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
            
    actual_id = business.get("id")
    
    skip = (page - 1) * size
    campaigns = await db.find_many("campaigns", {"business_id": actual_id}, skip=skip, limit=size)
    total = await db.count("campaigns", {"business_id": actual_id})
    
    campaigns.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return {
        "items": campaigns,
        "total": total,
        "page": page,
        "size": size
    }
