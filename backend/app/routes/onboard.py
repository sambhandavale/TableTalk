from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.database import db
from app.schemas.onboard import RestaurantOnboardRequest, RestaurantProfileUpdateRequest, UserLoginRequest


# Import Agent 1
from ai_workflow import audit_agent

import hashlib

router = APIRouter(prefix="/onboard", tags=["Onboarding"])

def hash_password(password: str) -> str:
    """Zero-dependency SHA-256 password hashing with a secure salt."""
    salt = "tabletalk_secure_salt_2026_"
    hash_obj = hashlib.sha256((salt + password).encode('utf-8'))
    return hash_obj.hexdigest()

async def trigger_background_audit(restaurant_id: str, maps_url: str):
    """Fires Agent 1 silently in background to scrape & audit Google Reviews."""
    await audit_agent.run_audit_flow(restaurant_id, maps_url)

@router.post("")
async def onboard_restaurant(request: RestaurantOnboardRequest, background_tasks: BackgroundTasks):
    # 1. Check if the business account email already exists
    existing_user = await db.find_one("users", {"email": request.email})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="A business account with this email is already registered."
        )

    slug = request.name.lower().replace(" ", "-").replace("&", "and")
    
    # Check if restaurant slug already exists
    existing_restaurant = await db.find_one("restaurants", {"slug": slug})
    if existing_restaurant:
        raise HTTPException(
            status_code=400,
            detail="A restaurant with this name has already been registered."
        )
        
    # 2. Onboard new restaurant entry
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
    
    # 3. Create secure business user account document
    new_user = {
        "email": request.email,
        "password_hash": hash_password(request.password),
        "restaurant_id": restaurant_id,
        "owner_contact": request.owner_contact,
        "role": "General Manager"
    }
    await db.insert_one("users", new_user)
    
    # Trigger AI Audit Agent 1 asynchronously in background to scrape Google reviews
    background_tasks.add_task(trigger_background_audit, restaurant_id, request.maps_url)
    
    return {
        "message": "Business account and restaurant onboarding successfully initiated. AI Audit dispatched.",
        "restaurant": saved_restaurant,
        "account": {
            "email": request.email,
            "role": "General Manager",
            "owner_contact": request.owner_contact
        },
        "wow_moment_ready": False
    }

@router.post("/login")
async def login_user(request: UserLoginRequest):
    # 1. Look up user by email
    user = await db.find_one("users", {"email": request.email})
    if not user:
        raise HTTPException(
            status_code=401,
            detail="No account registered with this email address."
        )
    
    # 2. Verify hashed password matches
    input_hash = hash_password(request.password)
    if user.get("password_hash") != input_hash:
        raise HTTPException(
            status_code=401,
            detail="Incorrect security password."
        )
    
    # 3. Look up associated restaurant details
    restaurant_id = user.get("restaurant_id")
    restaurant = await db.find_one("restaurants", {"id": restaurant_id})
    if not restaurant:
        # Check by slug fallback
        restaurant = await db.find_one("restaurants", {"slug": restaurant_id})
        if not restaurant:
            raise HTTPException(
                status_code=404,
                detail="Associated restaurant profile not found."
            )
            
    return {
        "message": "Security authentication successful.",
        "user": {
            "email": user.get("email"),
            "role": user.get("role", "General Manager"),
            "owner_contact": user.get("owner_contact")
        },
        "restaurant": {
            "id": restaurant.get("id"),
            "name": restaurant.get("name"),
            "slug": restaurant.get("slug"),
            "cuisine": restaurant.get("cuisine"),
            "location": restaurant.get("location"),
            "maps_url": restaurant.get("maps_url")
        }
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

@router.put("/{restaurant_id}/profile")
async def update_restaurant_profile(restaurant_id: str, request: RestaurantProfileUpdateRequest):
    # 1. Verify restaurant exists (by ID or Slug)
    restaurant = await db.find_one("restaurants", {"id": restaurant_id})
    if not restaurant:
        restaurant = await db.find_one("restaurants", {"slug": restaurant_id})
        if not restaurant:
            raise HTTPException(status_code=404, detail="Restaurant not found")
            
    actual_id = restaurant["id"]
    
    # 2. Prepare database update fields
    update_data = {
        "contact_phone": request.contact_phone,
        "business_hours": request.business_hours,
        "cost_for_two": request.cost_for_two,
        "pos_system": request.pos_system,
        "instagram_handle": request.instagram_handle,
        "website_url": request.website_url,
        "dining_duration_mins": request.dining_duration_mins,
        "is_pure_veg": request.is_pure_veg,
        "valet_parking": request.valet_parking,
        "seating_capacity": request.seating_capacity
    }
    
    # 3. Save updates into MongoDB restaurants collection
    success = await db.update_one("restaurants", {"id": actual_id}, {"$set": update_data})
    
    # Fetch refreshed document
    refreshed_restaurant = await db.find_one("restaurants", {"id": actual_id})
    
    return {
        "message": "Restaurant profile operational settings successfully updated.",
        "restaurant": refreshed_restaurant,
        "success": success
    }
