from fastapi import APIRouter, HTTPException
from app.database import db

# Import Agent 3 & Agent 4
from ai_workflow import analysis_agent

router = APIRouter(prefix="/insights", tags=["Insights & Recommendations"])

@router.get("/{slug}")
async def get_restaurant_insights(slug: str):
    restaurant = await db.find_one("restaurants", {"slug": slug})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
        
    restaurant_id = restaurant["id"]
    
    # Get latest compiled insights from DB
    insights_list = await db.get_collection("insights")
    restaurant_insights = [i for i in insights_list if i.get("restaurant_id") == restaurant_id]
    
    # If no insights yet, return a pending or execute a quick run
    if not restaurant_insights:
        # Run a quick analysis to generate initial metrics
        fresh_insights = await analysis_agent.generate_restaurant_insights(restaurant_id)
        return {
            "restaurant_name": restaurant["name"],
            "insights": fresh_insights
        }
        
    # Return latest compiled insights
    latest = sorted(restaurant_insights, key=lambda x: x.get("generated_date", ""), reverse=True)[0]
    return {
        "restaurant_name": restaurant["name"],
        "insights": latest
    }

@router.post("/{slug}/trigger")
async def trigger_insights_recompilation(slug: str):
    """Force recompiles all review analytics and weekly recommendations."""
    restaurant = await db.find_one("restaurants", {"slug": slug})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
        
    restaurant_id = restaurant["id"]
    
    # Execute Agents 3 & 4
    fresh_insights = await analysis_agent.generate_restaurant_insights(restaurant_id)
    
    return {
        "message": "Aggregated reviews and compiled fresh weekly action items successfully.",
        "insights": fresh_insights
    }
