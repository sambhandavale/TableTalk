from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.database import db
from app.schemas.onboard import RestaurantOnboardRequest

# Import Agent 1
from ai_workflow import audit_agent

router = APIRouter(prefix="/onboard", tags=["Onboarding"])

def trigger_background_audit(restaurant_id: str, maps_url: str):
    """Fires Agent 1 silently in background to scrape & audit Google Reviews."""
    import asyncio
    asyncio.run(audit_agent.run_audit_flow(restaurant_id, maps_url))

@router.post("")
async def onboard_restaurant(request: RestaurantOnboardRequest, background_tasks: BackgroundTasks):
    slug = request.name.lower().replace(" ", "-").replace("&", "and")
    
    # Check if already exists
    existing = await db.find_one("restaurants", {"slug": slug})
    if existing:
        return {
            "message": "Restaurant already onboarded",
            "restaurant": existing,
            "wow_moment_ready": True
        }
        
    # Onboard new restaurant entry
    new_restaurant = {
        "name": request.name,
        "cuisine": request.cuisine,
        "location": request.location,
        "owner_contact": request.owner_contact,
        "maps_url": request.maps_url,
        "seating_capacity": request.seating_capacity,
        "slug": slug,
        "health_score": 0,  # Initially pending audit
        "audit_completed": False
    }
    
    saved_restaurant = await db.insert_one("restaurants", new_restaurant)
    restaurant_id = saved_restaurant["id"]
    
    # Trigger AI Audit Agent 1 asynchronously in background to not block user onboarding finished screen
    background_tasks.add_task(trigger_background_audit, restaurant_id, request.maps_url)
    
    return {
        "message": "Onboarding initiated. Audit agent dispatched in background.",
        "restaurant": saved_restaurant,
        "wow_moment_ready": False
    }

@router.get("/{slug}/status")
async def get_onboarding_status(slug: str):
    restaurant = await db.find_one("restaurants", {"slug": slug})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
        
    reviews = await db.get_collection("reviews")
    restaurant_reviews = [r for r in reviews if r.get("restaurant_id") == restaurant.get("id")]
    
    # Find latest insights
    insights = await db.get_collection("insights")
    restaurant_insights = [i for i in insights if i.get("restaurant_id") == restaurant.get("id")]
    
    return {
        "restaurant": restaurant,
        "audit_completed": len(restaurant_reviews) > 0,
        "reviews_imported_count": len(restaurant_reviews),
        "latest_audit": restaurant_insights[0] if restaurant_insights else None
    }
