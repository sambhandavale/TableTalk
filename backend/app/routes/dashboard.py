from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from datetime import datetime, timezone, timedelta
from dateutil.relativedelta import relativedelta
import asyncio
from app.database import db

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

def parse_review_time(r):
    r_time_str = r.get("timestamp", r.get("created_at"))
    
    if isinstance(r_time_str, datetime):
        if r_time_str.tzinfo is None:
            r_time_str = r_time_str.replace(tzinfo=timezone.utc)
        return r_time_str
        
    try:
        if r_time_str:
            t = datetime.fromisoformat(str(r_time_str).replace("Z", "+00:00"))
            if t.tzinfo is None:
                t = t.replace(tzinfo=timezone.utc)
            return t
    except (ValueError, TypeError, AttributeError):
        pass
    return None

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
async def get_dashboard_data(business_id: str, mode: str = "all", page: int = 1, size: int = 20):
    # 1. Fetch Business
    business = await db.find_one("businesses", {"id": business_id})
    if not business:
        business = await db.find_one("businesses", {"slug": business_id})
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
    
    actual_id = business.get("id")

    # ------------------
    # Compute time window based on mode
    # ------------------
    now = datetime.now(timezone.utc)

    # stats filter window
    if mode == "daily":
        window_start = now - timedelta(hours=24)
        query_start = now - timedelta(days=7)  # daily chart needs 7 days
    elif mode == "weekly":
        window_start = now - timedelta(days=7)
        query_start = now - timedelta(days=28)  # weekly chart needs 28 days (4 weeks)
    elif mode == "monthly":
        window_start = now - timedelta(days=30)
        query_start = now - relativedelta(months=6)  # monthly chart needs 6 months
    else:  # all
        window_start = None
        query_start = None

    # Use query filters based on query_start to avoid truncating chart data
    review_query = {"business_id": actual_id}
    if query_start:
        review_query["timestamp"] = {"$gte": query_start}

    # Aggregate coupons
    coupons = await db.find_many("coupons", {"business_id": actual_id})
    business["coupons"] = coupons

    # 2. Fetch related collections
    reviews = await db.find_many("reviews", review_query)
    insights = await db.find_many("insights", {"business_id": actual_id})
            
    # For the AI Insights, we now use a Unified Live Report, irrespective of the chart mode
    unified_insights = [i for i in insights if i.get("mode") == "unified"]
    all_mode_insights = [i for i in insights if i.get("mode") == "all"]
    
    if unified_insights:
        unified_insights.sort(key=lambda x: x.get("generated_date", ""), reverse=True)
        latest_insight = unified_insights[0]
    elif all_mode_insights:
        all_mode_insights.sort(key=lambda x: x.get("generated_date", ""), reverse=True)
        latest_insight = all_mode_insights[0]
    else:
        latest_insight = None

    campaigns = await db.find_many("campaigns", {"business_id": actual_id})
    customers = await db.find_many("customers", {"business_id": actual_id})
    competitors = await db.find_many("competitors", {"business_id": actual_id})

    # For pagination of recent reviews
    skip = (page - 1) * size
    paginated_reviews = await db.find_many("reviews", {"business_id": actual_id}, skip=skip, limit=size)
    total_reviews_count = await db.count("reviews", {"business_id": actual_id})
    
    paginated_reviews_wrapper = {
        "items": paginated_reviews,
        "total": total_reviews_count,
        "page": page,
        "size": size
    }

    # Filter reviews within the time window for stats
    if window_start:
        windowed_reviews = [r for r in reviews if parse_review_time(r) and parse_review_time(r) >= window_start]
    else:
        windowed_reviews = reviews

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
        r_time = None
        if isinstance(r_time_str, datetime):
            r_time = r_time_str
            if r_time.tzinfo is None:
                r_time = r_time.replace(tzinfo=timezone.utc)
        else:
            try:
                if r_time_str:
                    r_time = datetime.fromisoformat(str(r_time_str).replace("Z", "+00:00"))
                    if r_time.tzinfo is None:
                        r_time = r_time.replace(tzinfo=timezone.utc)
            except (ValueError, TypeError, AttributeError):
                pass
                
        if r_time and r_time >= velocity_start:
            recent_reviews.append(r)
            
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
            month_start = (now.replace(day=1, hour=0, minute=0, second=0, microsecond=0) - relativedelta(months=i))
            if i > 0:
                month_end = (now.replace(day=1, hour=0, minute=0, second=0, microsecond=0) - relativedelta(months=i-1))
            else:
                month_end = now + relativedelta(months=1)
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
            cursor = earliest.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            
            months_diff = (current_month.year - cursor.year) * 12 + current_month.month - cursor.month
            if months_diff < 5:
                cursor = current_month - relativedelta(months=5)

            while cursor <= current_month:
                next_cursor = cursor + relativedelta(months=1)
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
    windowed_insights = []
    
    if window_start is not None:
        for i in sorted_insights:
            g_date = i.get("generated_date")
            if not g_date:
                continue
                
            if isinstance(g_date, str):
                g_date = parse_review_time({"timestamp": g_date})
                
            if isinstance(g_date, datetime):
                if g_date.tzinfo is None:
                    g_date = g_date.replace(tzinfo=timezone.utc)
                if g_date >= window_start:
                    windowed_insights.append(i)
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
        "reviews": paginated_reviews_wrapper,
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
