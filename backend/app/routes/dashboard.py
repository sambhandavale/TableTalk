from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone, timedelta
from app.database import db

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.post("/track-scan/{business_id}")
async def track_qr_scan(business_id: str):
    # Try finding the business
    business = await db.find_one("businesses", {"id": business_id})
    if not business:
        business = await db.find_one("businesses", {"slug": business_id})
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
    
    actual_id = business.get("id")
    
    # Increment the qr_scan_count for the business
    await db.update_one(
        "businesses",
        {"id": actual_id},
        {"$inc": {"qr_scan_count": 1}}
    )
    return {"status": "success", "message": "Scan tracked"}

@router.get("/{business_id}")
async def get_dashboard_data(business_id: str):
    # 1. Fetch Business
    business = await db.find_one("businesses", {"id": business_id})
    if not business:
        business = await db.find_one("businesses", {"slug": business_id})
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
    
    actual_id = business.get("id")

    # Aggregate coupons
    coupons = []
    all_coupons = await db.get_collection("coupons")
    for c in all_coupons:
        if c.get("business_id") == actual_id:
            coupons.append(c)
    business["coupons"] = coupons

    # 2. Fetch all related collections
    reviews = []
    all_reviews = await db.get_collection("reviews")
    for r in all_reviews:
        if r.get("business_id") == actual_id:
            reviews.append(r)
            
    insights = []
    all_insights = await db.get_collection("insights")
    for i in all_insights:
        if i.get("business_id") == actual_id:
            insights.append(i)
            
    # Sort insights by date descending to get the latest
    insights.sort(key=lambda x: x.get("generated_date", ""), reverse=True)
    latest_insight = insights[0] if insights else None

    campaigns = []
    all_campaigns = await db.get_collection("campaigns")
    for c in all_campaigns:
        if c.get("business_id") == actual_id:
            campaigns.append(c)

    customers = []
    all_customers = await db.get_collection("customers")
    for cust in all_customers:
        if cust.get("business_id") == actual_id:
            customers.append(cust)
            
    competitors = []
    all_competitors = await db.get_collection("competitors")
    for comp in all_competitors:
        if comp.get("business_id") == actual_id:
            competitors.append(comp)

    qr_reviews = [r for r in reviews if r.get("source") in ["qr", "tabletalk"]]
    feedback_submitted = len(qr_reviews)
    redirected = len([r for r in qr_reviews if r.get("rating", 5) >= 4])
    google_reviews = [r for r in reviews if r.get("source") == "google"]
    confirmed_google = len(google_reviews)
    
    total_scans = business.get("qr_scan_count", 0)
    
    # Calculate coupon redemption rate properly
    total_coupon_dispatched = len(qr_reviews)  # Assuming all qr reviews got a coupon for now or tracked otherwise
    total_redemptions = sum(c.get("redemption_count", 0) for c in campaigns) # Simplification
    coupon_redemption_rate = 0 # No direct redemption tracking yet
    
    # ------------------
    # Calculate Real SEO Stats
    # ------------------
    now = datetime.now(timezone.utc)
    thirty_days_ago = now - timedelta(days=30)
    
    recent_reviews = []
    google_responses = 0
    total_rating = 0
    
    for r in google_reviews:
        r_time_str = r.get("timestamp", r.get("created_at"))
        try:
            if r_time_str:
                r_time = datetime.fromisoformat(r_time_str.replace("Z", "+00:00"))
                if r_time >= thirty_days_ago:
                    recent_reviews.append(r)
        except ValueError:
            pass
            
        if r.get("owner_approved_reply"):
            google_responses += 1
            
        total_rating += r.get("rating", 5)
            
    review_velocity = len(recent_reviews)
    response_rate = int((google_responses / confirmed_google * 100)) if confirmed_google > 0 else 0
    average_rating = round(total_rating / confirmed_google, 1) if confirmed_google > 0 else 0.0
    
    # Simple Completeness Check (Name, location, cuisine, maps_url, owner_contact)
    fields = ["name", "location", "cuisine", "maps_url", "owner_contact"]
    filled = sum(1 for f in fields if business.get(f))
    profile_completeness = int((filled / len(fields)) * 100)
    
    seo_score = int((response_rate * 0.4) + ((average_rating/5.0) * 40) + min(review_velocity * 2, 20))
    if confirmed_google == 0:
        seo_score = 0

    seo_stats = {
        "score": seo_score,
        "response_rate": response_rate,
        "review_velocity": review_velocity,
        "average_rating": average_rating,
        "profile_completeness": profile_completeness
    }
    
    # ------------------
    # Calculate Real Chart Data
    # ------------------
    # Weekly aggregation for the last 4 weeks
    week_volumes = [0, 0, 0, 0]
    for r in reviews:
        r_time_str = r.get("timestamp", r.get("created_at"))
        try:
            if r_time_str:
                r_time = datetime.fromisoformat(r_time_str.replace("Z", "+00:00"))
                days_diff = (now - r_time).days
                if 0 <= days_diff < 7:
                    week_volumes[3] += 1
                elif 7 <= days_diff < 14:
                    week_volumes[2] += 1
                elif 14 <= days_diff < 21:
                    week_volumes[1] += 1
                elif 21 <= days_diff < 28:
                    week_volumes[0] += 1
        except ValueError:
            pass
            
    chart_data = [
        {"name": "W1", "volume": week_volumes[0]},
        {"name": "W2", "volume": week_volumes[1]},
        {"name": "W3", "volume": week_volumes[2]},
        {"name": "W4", "volume": week_volumes[3]},
    ]
    
    # Health Sparkline from historical insights (oldest to newest)
    sorted_insights = sorted(insights, key=lambda x: x.get("generated_date", ""))
    sparkline = [{"score": i.get("health_score", 0)} for i in sorted_insights[-8:]]
    if not sparkline:
        sparkline = [{"score": business.get("health_score", 0)}] * 8 # flat line if no insights

    return {
        "business": business,
        "reviews": reviews,
        "insights": latest_insight,
        "all_insights": insights,
        "campaigns": campaigns,
        "customers": customers,
        "competitors": competitors,
        "audit_status": {
            "audit_completed": business.get("audit_completed", False),
            "reviews_imported_count": len(reviews)
        },
        "qr_stats": {
            "total_scans": total_scans,
            "feedback_submitted": feedback_submitted,
            "redirected": redirected,
            "confirmed_google": confirmed_google,
            "redemption_rate": coupon_redemption_rate
        },
        "seo_stats": seo_stats,
        "chart_data": chart_data,
        "health_sparkline": sparkline
    }
