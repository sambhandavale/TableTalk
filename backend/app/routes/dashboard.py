from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from datetime import datetime, timezone, timedelta
import asyncio
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

@router.get("/{business_id}/stream")
async def stream_dashboard_status(business_id: str):
    async def event_generator():
        last_status = False
        while True:
            # Check business audit_completed status
            business = await db.find_one("businesses", {"id": business_id})
            if not business:
                business = await db.find_one("businesses", {"slug": business_id})
                
            if business:
                current_status = business.get("audit_completed", False)
                if current_status and not last_status:
                    yield f"data: reload\n\n"
                    last_status = current_status
            
            await asyncio.sleep(2)
            # Send keep-alive
            yield f": keep-alive\n\n"
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/{business_id}")
async def get_dashboard_data(business_id: str, mode: str = "all"):
    def is_in_window(timestamp_str, window_start):
        if window_start is None:
            return True
        try:
            t = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
            if t.tzinfo is None:
                t = t.replace(tzinfo=timezone.utc)
            return t >= window_start
        except (ValueError, TypeError, AttributeError):
            return False

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

    # ------------------
    # Compute time window based on mode
    # ------------------
    now = datetime.now(timezone.utc)

    if mode == "daily":
        window_start = now - timedelta(hours=24)
    elif mode == "weekly":
        window_start = now - timedelta(days=7)
    elif mode == "monthly":
        window_start = now - timedelta(days=30)
    else:  # all
        window_start = None

    # Filter reviews within the time window for stats
    windowed_reviews = [r for r in reviews if is_in_window(r.get('timestamp', r.get('created_at', '')), window_start)]

    # ------------------
    # QR Stats (scoped to window)
    # ------------------
    qr_reviews = [r for r in windowed_reviews if r.get("source") in ["qr", "tabletalk"]]
    feedback_submitted = len(qr_reviews)
    redirected = len([r for r in qr_reviews if r.get("rating", 5) >= 4])
    google_reviews = [r for r in windowed_reviews if r.get("source") == "google"]
    confirmed_google = len(google_reviews)
    
    total_scans = business.get("qr_scan_count", 0)
    
    # Calculate coupon redemption rate properly
    total_coupon_dispatched = len(qr_reviews)  # Assuming all qr reviews got a coupon for now or tracked otherwise
    total_redemptions = sum(c.get("redemption_count", 0) for c in campaigns) # Simplification
    coupon_redemption_rate = 0 # No direct redemption tracking yet
    
    # ------------------
    # Calculate Real SEO Stats
    # ------------------
    # Use window_start for review_velocity instead of hardcoded thirty_days_ago
    velocity_start = window_start if window_start is not None else (now - timedelta(days=30))
    
    recent_reviews = []
    google_responses = 0
    total_rating = 0
    
    for r in google_reviews:
        r_time_str = r.get("timestamp", r.get("created_at"))
        try:
            if r_time_str:
                r_time = datetime.fromisoformat(r_time_str.replace("Z", "+00:00"))
                if r_time.tzinfo is None:
                    r_time = r_time.replace(tzinfo=timezone.utc)
                if r_time >= velocity_start:
                    recent_reviews.append(r)
        except (ValueError, TypeError, AttributeError):
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
    # Calculate Real Chart Data (dynamic bucketing based on mode)
    # ------------------
    def parse_review_time(r):
        r_time_str = r.get("timestamp", r.get("created_at"))
        try:
            if r_time_str:
                t = datetime.fromisoformat(r_time_str.replace("Z", "+00:00"))
                if t.tzinfo is None:
                    t = t.replace(tzinfo=timezone.utc)
                return t
        except (ValueError, TypeError, AttributeError):
            pass
        return None

    chart_data = []

    if mode == "daily":
        # 7 bars, one per day for the last 7 days
        day_volumes = [0] * 7
        for r in reviews:
            r_time = parse_review_time(r)
            if r_time:
                days_diff = (now - r_time).days
                if 0 <= days_diff < 7:
                    day_volumes[6 - days_diff] += 1
        for i in range(7):
            day = now - timedelta(days=6 - i)
            label = day.strftime("%a")
            chart_data.append({"name": label, "volume": day_volumes[i]})

    elif mode == "weekly":
        # 4 bars, one per week for the last 4 weeks (original behavior)
        week_volumes = [0, 0, 0, 0]
        for r in reviews:
            r_time = parse_review_time(r)
            if r_time:
                days_diff = (now - r_time).days
                if 0 <= days_diff < 7:
                    week_volumes[3] += 1
                elif 7 <= days_diff < 14:
                    week_volumes[2] += 1
                elif 14 <= days_diff < 21:
                    week_volumes[1] += 1
                elif 21 <= days_diff < 28:
                    week_volumes[0] += 1
        chart_data = [
            {"name": "W1", "volume": week_volumes[0]},
            {"name": "W2", "volume": week_volumes[1]},
            {"name": "W3", "volume": week_volumes[2]},
            {"name": "W4", "volume": week_volumes[3]},
        ]

    elif mode == "monthly":
        # 6 bars, one per month for the last 6 months
        for i in range(5, -1, -1):
            month_start = (now.replace(day=1) - timedelta(days=30 * i)).replace(day=1)
            if i > 0:
                month_end = (now.replace(day=1) - timedelta(days=30 * (i - 1))).replace(day=1)
            else:
                month_end = now
            label = month_start.strftime("%b")
            count = 0
            for r in reviews:
                r_time = parse_review_time(r)
                if r_time and month_start <= r_time < month_end:
                    count += 1
            chart_data.append({"name": label, "volume": count})

    else:  # all
        # Group all reviews by month since the earliest review
        review_times = []
        for r in reviews:
            r_time = parse_review_time(r)
            if r_time:
                review_times.append(r_time)
        
        if review_times:
            earliest = min(review_times)
            # Walk from earliest month to current month
            cursor = earliest.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            while cursor <= current_month:
                # Next month boundary
                if cursor.month == 12:
                    next_cursor = cursor.replace(year=cursor.year + 1, month=1)
                else:
                    next_cursor = cursor.replace(month=cursor.month + 1)
                label = cursor.strftime("%b %Y")
                count = sum(1 for rt in review_times if cursor <= rt < next_cursor)
                chart_data.append({"name": label, "volume": count})
                cursor = next_cursor
        else:
            # No reviews at all — return empty weekly chart as fallback
            chart_data = [
                {"name": "W1", "volume": 0},
                {"name": "W2", "volume": 0},
                {"name": "W3", "volume": 0},
                {"name": "W4", "volume": 0},
            ]
    
    # ------------------
    # Health Sparkline from historical insights (filtered by window)
    # ------------------
    sorted_insights = sorted(insights, key=lambda x: x.get("generated_date", ""))
    if window_start is not None:
        windowed_insights = [i for i in sorted_insights if is_in_window(i.get("generated_date", ""), window_start)]
    else:
        windowed_insights = sorted_insights
    sparkline = [{"score": i.get("health_score", 0)} for i in windowed_insights[-8:]]
    if not sparkline:
        sparkline = [{"score": business.get("health_score", 0)}] * 8 # flat line if no insights

    # ------------------
    # Mode metadata
    # ------------------
    mode_labels = {
        "daily": {"range_label": "Last 24 Hours", "chart_label": "Daily Review Volume"},
        "weekly": {"range_label": "Last 7 Days", "chart_label": "Weekly Review Volume"},
        "monthly": {"range_label": "Last 30 Days", "chart_label": "Monthly Review Volume"},
        "all": {"range_label": "All Time", "chart_label": "Review Volume Over Time"}
    }
    mode_meta = {"mode": mode, **mode_labels.get(mode, mode_labels["all"])}

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
        "health_sparkline": sparkline,
        "mode_meta": mode_meta
    }
