from fastapi import APIRouter, HTTPException
from app.database import db

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/{restaurant_id}")
async def get_dashboard_data(restaurant_id: str):
    # 1. Fetch Restaurant
    restaurant = await db.find_one("restaurants", {"id": restaurant_id})
    if not restaurant:
        restaurant = await db.find_one("restaurants", {"slug": restaurant_id})
        if not restaurant:
            raise HTTPException(status_code=404, detail="Restaurant not found")
    
    actual_id = restaurant.get("id")

    # 2. Fetch all related collections
    reviews = []
    all_reviews = await db.get_collection("reviews")
    for r in all_reviews:
        if r.get("restaurant_id") == actual_id:
            reviews.append(r)
            
    insights = []
    all_insights = await db.get_collection("insights")
    for i in all_insights:
        if i.get("restaurant_id") == actual_id:
            insights.append(i)
            
    # Sort insights by date descending to get the latest
    insights.sort(key=lambda x: x.get("generated_date", ""), reverse=True)
    latest_insight = insights[0] if insights else None

    campaigns = []
    all_campaigns = await db.get_collection("campaigns")
    for c in all_campaigns:
        if c.get("restaurant_id") == actual_id:
            campaigns.append(c)

    customers = []
    all_customers = await db.get_collection("customers")
    for cust in all_customers:
        if cust.get("restaurant_id") == actual_id:
            customers.append(cust)
            
    competitors = []
    all_competitors = await db.get_collection("competitors")
    for comp in all_competitors:
        if comp.get("restaurant_id") == actual_id:
            competitors.append(comp)

    return {
        "restaurant": restaurant,
        "reviews": reviews,
        "insights": latest_insight,
        "all_insights": insights,
        "campaigns": campaigns,
        "customers": customers,
        "competitors": competitors,
        "audit_status": {
            "audit_completed": restaurant.get("audit_completed", False),
            "reviews_imported_count": len(reviews)
        }
    }
