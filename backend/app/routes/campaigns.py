from fastapi import APIRouter, HTTPException, Body
from app.database import db
from app.schemas.campaign import LaunchCampaignRequest

router = APIRouter(prefix="/campaigns", tags=["Campaigns & Retention"])

@router.get("/{slug}")
async def get_campaigns_and_segments(slug: str):
    restaurant = await db.find_one("restaurants", {"slug": slug})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
        
    restaurant_id = restaurant["id"]
    
    # Fetch all campaigns for this restaurant
    all_campaigns = await db.get_collection("campaigns")
    filtered_campaigns = [c for c in all_campaigns if c.get("restaurant_id") == restaurant_id]
    
    # Count segment sizes from customers collection
    all_customers = await db.get_collection("customers")
    restaurant_customers = [cust for cust in all_customers if cust.get("restaurant_id") == restaurant_id]
    
    segments = {
        "Happy Regular": len([c for c in restaurant_customers if c.get("segment") == "Happy Regular"]),
        "At-Risk": len([c for c in restaurant_customers if c.get("segment") == "At-Risk"]),
        "Lost/Unhappy": len([c for c in restaurant_customers if c.get("segment") == "Lost/Unhappy"]),
        "New Customer": len([c for c in restaurant_customers if c.get("segment") == "New Customer"])
    }
    
    return {
        "restaurant_name": restaurant["name"],
        "segments": segments,
        "active_campaigns": filtered_campaigns
    }

@router.post("/{slug}/launch")
async def launch_campaign(slug: str, request: LaunchCampaignRequest):
    restaurant = await db.find_one("restaurants", {"slug": slug})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
        
    restaurant_id = restaurant["id"]
    
    # Calculate recipient count based on segment customers in DB
    all_customers = await db.get_collection("customers")
    recipients = [c for c in all_customers if c.get("restaurant_id") == restaurant_id and c.get("segment") == request.segment]
    
    # Create new campaign entry
    campaign_data = {
        "restaurant_id": restaurant_id,
        "segment": request.segment,
        "message": request.message,
        "coupon_code": request.coupon_code.upper(),
        "discount_pct": request.discount_pct,
        "sent_count": len(recipients),
        "redemption_count": 0,
        "status": "launched",
        "timestamp": "2026-05-25T18:05:00Z"
    }
    
    saved_campaign = await db.insert_one("campaigns", campaign_data)
    
    return {
        "message": f"Successfully launched marketing campaign targeting {len(recipients)} {request.segment} customers!",
        "campaign": saved_campaign
    }
