from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.database import db
from app.schemas.onboard import BusinessOnboardRequest, BusinessProfileUpdateRequest, UserLoginRequest
from app.core.utils import resolve_maps_url

# Import Agent 1
from ai_workflow import audit_agent

from passlib.context import CryptContext
from app.core.auth import create_access_token

router = APIRouter(prefix="/onboard", tags=["Onboarding"])

def hash_password(password: str) -> str:
    import bcrypt
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    import bcrypt
    import hashlib
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except ValueError:
        salt = "tabletalk_secure_salt_2026_"
        old_hash = hashlib.sha256((salt + plain_password).encode('utf-8')).hexdigest()
        return old_hash == hashed_password

from datetime import datetime, timezone

async def _do_background_audit(business_id: str, maps_url: str):
    """Fires Agent 1 in background to scrape & audit Google Reviews, then generates real insights."""
    import logging
    logger = logging.getLogger("TableTalk.BackendAudit")
    logger.info(f"Orchestrating onboarding audit & scraper workflow for Business ID: {business_id}")
    
    try:
        # 1. Resolve shortened Maps link redirects
        resolved_url = await resolve_maps_url(maps_url)
        
        # 2. Retrieve business context metadata for targeted LLM scraping
        business = await db.find_one("businesses", {"id": business_id})
        if not business:
            business = await db.find_one("businesses", {"slug": business_id})
            
        name = business.get("name", "Unknown Business") if business else "Unknown Business"
        cuisine = business.get("cuisine", "Multi-Cuisine") if business else "Multi-Cuisine"
        location = business.get("location", "Mumbai") if business else "Mumbai"
        
        # 3. Call CID AJAX Scraper Utility to extract real reviews first
        from app.core.utils import scrape_real_google_reviews
        real_reviews = await scrape_real_google_reviews(resolved_url)
        
        # 3.5 Ingest Raw Reviews to MongoDB safely
        if real_reviews:
            import uuid
            for rr in real_reviews:
                rr["business_id"] = business_id
                rr["raw_review_id"] = f"raw-{uuid.uuid4().hex[:8]}"
            await db.insert_many("raw_reviews", real_reviews)
            logger.info(f"Ingested {len(real_reviews)} raw reviews safely to database.")
        
        # 4. Call Pure AI Scraper Agent to structure and enrich reviews
        raw_reviews = await audit_agent.scrape_reviews_flow(
            name=name,
            cuisine=cuisine,
            location=location,
            maps_url=resolved_url,
            real_scraped_reviews=real_reviews or None
        )
        
        # 5. Save reviews collection records to MongoDB (Business / DB logic)
        from ai_workflow.services.embedding_service import embedding_service
        saved_reviews = []
        for r in raw_reviews:
            r["business_id"] = business_id
            
            # Merge actual metadata from the live scraper if matched
            if real_reviews:
                for real_r in real_reviews:
                    real_text = real_r.get("text") or ""
                    r_text = r.get("text") or ""
                    
                    if real_r.get("diner_name") == r.get("diner_name") or (r_text and r_text[:20] in real_text):
                        r["timestamp"] = real_r.get("timestamp", r.get("timestamp", datetime.now(timezone.utc)))
                        if "owner_approved_reply" in real_r:
                            r["owner_approved_reply"] = real_r["owner_approved_reply"]
                        if "final_reply_content" in real_r:
                            r["final_reply_content"] = real_r["final_reply_content"]
                        break
            
            # Parse timestamp to native datetime if it is a string
            ts_val = r.get("timestamp")
            if not ts_val:
                ts_val = datetime.now(timezone.utc)
            elif isinstance(ts_val, str):
                try:
                    parsed_ts = datetime.fromisoformat(ts_val.replace("Z", "+00:00"))
                    if parsed_ts.tzinfo is None:
                        parsed_ts = parsed_ts.replace(tzinfo=timezone.utc)
                    ts_val = parsed_ts
                except Exception:
                    ts_val = datetime.now(timezone.utc)
            r["timestamp"] = ts_val
            
            # Generate and attach embedding
            r_text = r.get("text", "")
            if r_text:
                embeddings = await embedding_service.generate_embeddings([r_text])
                if embeddings and len(embeddings) > 0:
                    r["embedding"] = embeddings[0]

            saved = await db.insert_one("reviews", r)
            saved_reviews.append(saved)
        
        logger.info(f"Saved {len(saved_reviews)} scraped reviews to MongoDB.")
        
        # 5. Generate REAL insights using Analysis Agent
        from ai_workflow import analysis_agent
        await analysis_agent.generate_restaurant_insights(business_id)
        
        # Get the latest generated insight to update health score
        latest_insight = await db.get_collection("insights")
        latest_insight = [i for i in latest_insight if i.get("business_id") == business_id]
        health_score = latest_insight[-1].get("health_score", 0) if latest_insight else 0

        
        # 8. Mark business audit status as complete & update operational health index
        await db.update_one(
            "businesses",
            {"id": business_id},
            {"$set": {"health_score": health_score, "audit_completed": True}}
        )
        
        logger.info(f"Onboarding background audit completed successfully for Business ID: {business_id}")
        
    except Exception as e:
        logger.error(f"Onboarding background audit encountered error: {e}", exc_info=True)
        # Ensure UI unblocks
        await db.update_one("businesses", {"id": business_id}, {"$set": {"audit_completed": True, "audit_failed": True}})

from app.schemas.onboard import BusinessOnboardRequest, BusinessProfileUpdateRequest, UserLoginRequest, OnboardResponse, LoginResponse

@router.post("", response_model=OnboardResponse)
async def onboard_restaurant(request: BusinessOnboardRequest, background_tasks: BackgroundTasks):
    # 1. Check if the business account email already exists
    clean_email = request.email.strip().lower()
    existing_user = await db.find_one("users", {"email": clean_email})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="A business account with this email is already registered."
        )

    slug = request.name.lower().replace(" ", "-").replace("&", "and")
    
    # Check if business slug already exists
    existing_restaurant = await db.find_one("businesses", {"slug": slug})
    if existing_restaurant:
        raise HTTPException(
            status_code=400,
            detail="A business with this name has already been registered."
        )
        
    # 2. Onboard new business entry
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
    
    saved_restaurant = await db.insert_one("businesses", new_restaurant)
    business_id = saved_restaurant["id"]
    
    # 3. Create secure business user account document
    clean_email = request.email.strip().lower()
    new_user = {
        "email": clean_email,
        "password_hash": hash_password(request.password),
        "business_id": business_id,
        "owner_contact": request.owner_contact,
        "role": "General Manager"
    }
    await db.insert_one("users", new_user)
    
    # Trigger AI Audit Agent 1 asynchronously in background via FastAPI BackgroundTasks instead of Celery
    background_tasks.add_task(_do_background_audit, business_id, request.maps_url)
    
    access_token = create_access_token(data={"sub": clean_email, "business_id": business_id})

    return {
        "message": "Business account and business onboarding successfully initiated. AI Audit dispatched.",
        "business": saved_restaurant,
        "account": {
            "email": request.email,
            "role": "General Manager",
            "owner_contact": request.owner_contact
        },
        "access_token": access_token,
        "token_type": "bearer",
        "wow_moment_ready": False
    }

@router.post("/login", response_model=LoginResponse)
async def login_user(request: UserLoginRequest):
    # 1. Clean email and look up user
    email = request.email.strip().lower()
    user = await db.find_one("users", {"email": email})
    if not user:
        raise HTTPException(
            status_code=401,
            detail="No account registered with this email address."
        )
    
    # 2. Verify hashed password matches
    if not verify_password(request.password, user.get("password_hash")):
        raise HTTPException(
            status_code=401,
            detail="Incorrect security password."
        )
    
    # 3. Look up associated business details
    business_id = user.get("business_id")
    business = await db.find_one("businesses", {"id": business_id})
    if not business:
        # Check by slug fallback
        business = await db.find_one("businesses", {"slug": business_id})
        if not business:
            raise HTTPException(
                status_code=404,
                detail="Associated business profile not found."
            )
            
    access_token = create_access_token(data={"sub": user.get("email"), "business_id": business.get("id")})

    return {
        "message": "Security authentication successful.",
        "user": {
            "email": user.get("email"),
            "role": user.get("role", "General Manager"),
            "owner_contact": user.get("owner_contact")
        },
        "business": {
            "id": business.get("id"),
            "name": business.get("name"),
            "slug": business.get("slug"),
            "cuisine": business.get("cuisine"),
            "location": business.get("location"),
            "maps_url": business.get("maps_url")
        },
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/{slug}/status")
async def get_onboarding_status(slug: str):
    business = await db.find_one("businesses", {"slug": slug})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
        
    reviews = await db.get_collection("reviews")
    restaurant_reviews = [r for r in reviews if r.get("business_id") == business.get("id")]
    
    # Find latest insights
    insights = await db.get_collection("insights")
    restaurant_insights = [i for i in insights if i.get("business_id") == business.get("id")]
    
    return {
        "business": business,
        "audit_completed": len(restaurant_reviews) > 0,
        "reviews_imported_count": len(restaurant_reviews),
        "latest_audit": restaurant_insights[0] if restaurant_insights else None
    }

@router.put("/{business_id}/profile")
async def update_restaurant_profile(business_id: str, request: BusinessProfileUpdateRequest):
    # 1. Verify business exists (by ID or Slug)
    business = await db.find_one("businesses", {"id": business_id})
    if not business:
        business = await db.find_one("businesses", {"slug": business_id})
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
            
    actual_id = business["id"]
    
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
        "seating_capacity": request.seating_capacity,
        "has_incentives": request.has_incentives
    }
    
    # 3. Save updates into MongoDB businesses collection
    success = await db.update_one("businesses", {"id": actual_id}, {"$set": update_data})
    
    # 4. Handle decoupled coupons
    await db.delete_many("coupons", {"business_id": actual_id})
    if request.coupons and len(request.coupons) > 0:
        new_coupons = []
        for c in request.coupons:
            c_dict = dict(c) if hasattr(c, 'dict') else c
            c_dict["business_id"] = actual_id
            c_dict["is_active"] = True
            new_coupons.append(c_dict)
        await db.insert_many("coupons", new_coupons)
    
    # Fetch refreshed document
    refreshed_restaurant = await db.find_one("businesses", {"id": actual_id})
    
    return {
        "message": "Business profile operational settings successfully updated.",
        "business": refreshed_restaurant,
        "success": success
    }
