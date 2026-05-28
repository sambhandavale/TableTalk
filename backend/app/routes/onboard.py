from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.database import db
from app.schemas.onboard import RestaurantOnboardRequest, RestaurantProfileUpdateRequest, UserLoginRequest
from app.core.utils import resolve_maps_url

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
    import logging
    logger = logging.getLogger("TableTalk.BackendAudit")
    logger.info(f"Orchestrating onboarding audit & scraper workflow for Restaurant ID: {restaurant_id}")
    
    try:
        # 1. Resolve shortened Maps link redirects
        resolved_url = await resolve_maps_url(maps_url)
        
        # 2. Retrieve restaurant context metadata for targeted LLM scraping
        restaurant = await db.find_one("restaurants", {"id": restaurant_id})
        if not restaurant:
            restaurant = await db.find_one("restaurants", {"slug": restaurant_id})
            
        name = restaurant.get("name", "Unknown Restaurant") if restaurant else "Unknown Restaurant"
        cuisine = restaurant.get("cuisine", "Multi-Cuisine") if restaurant else "Multi-Cuisine"
        location = restaurant.get("location", "Mumbai") if restaurant else "Mumbai"
        
        # 3. Call Pure AI Scraper Agent to fetch reviews structured
        raw_reviews = await audit_agent.scrape_reviews_flow(
            name=name,
            cuisine=cuisine,
            location=location,
            maps_url=resolved_url
        )
        
        # 4. Save reviews collection records to MongoDB (Business / DB logic)
        saved_reviews = []
        for r in raw_reviews:
            r["restaurant_id"] = restaurant_id
            saved = await db.insert_one("reviews", r)
            saved_reviews.append(saved)
        
        logger.info(f"Saved {len(saved_reviews)} scraped reviews to MongoDB.")
        
        # 5. Compile reviews for structured AI Sentiment Analysis Agent
        reviews_summary_text = "\n".join([f"Rating: {r['rating']} - Text: {r['text']}" for r in raw_reviews])
        analysis_result = await audit_agent.analyze_reviews_flow(
            reviews_summary_text=reviews_summary_text,
            maps_url=resolved_url
        )
        
        # 6. Draft recovery dynamic responses for each imported review
        for rev in saved_reviews:
            items = rev.get("ordered_items", [])
            item_ref = f"our {', '.join(items)}" if items else "our food and service"
            if rev["rating"] <= 3:
                draft = f"Thank you for your feedback, {rev.get('diner_name', 'Guest')}. We sincerely apologize for the delay regarding your {item_ref}. We have addressed this with our kitchen team and hope to welcome you back to offer a much smoother service."
                await db.update_one("reviews", {"id": rev["id"]}, {"$set": {"ai_response_draft": draft}})
            else:
                draft = f"Hi {rev.get('diner_name', 'Guest')}! We are thrilled to hear you loved our {item_ref}! Our team takes great pride in crafting these fresh daily. Looking forward to your next visit!"
                await db.update_one("reviews", {"id": rev["id"]}, {"$set": {"ai_response_draft": draft}})
                
        # 7. Write consolidated insights records to MongoDB
        insights_data = {
            "restaurant_id": restaurant_id,
            "generated_date": "2026-05-25T18:00:00Z",
            "themes": {
                "praised": analysis_result.praised,
                "complaints": [c.issue for c in analysis_result.complaints]
            },
            "health_score": analysis_result.health_score,
            "action_items": analysis_result.action_items
        }
        await db.insert_one("insights", insights_data)
        
        # 8. Mark restaurant audit status as complete & update operational health index
        await db.update_one(
            "restaurants",
            {"id": restaurant_id},
            {"$set": {"health_score": analysis_result.health_score, "audit_completed": True}}
        )
        
        logger.info(f"Onboarding background audit completed successfully for Restaurant ID: {restaurant_id}")
        
    except Exception as e:
        logger.error(f"Onboarding background audit encountered error: {e}", exc_info=True)

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
