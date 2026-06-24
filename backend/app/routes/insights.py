from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone, timedelta
from app.database import db

# Import Agent 3 & Agent 4
from ai_workflow import analysis_agent

router = APIRouter(prefix="/insights", tags=["Insights & Recommendations"])

@router.get("/{slug}")
async def get_restaurant_insights(slug: str, mode: str = "all"):
    business = await db.find_one("businesses", {"slug": slug})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
        
    business_id = business["id"]
    
    # Get latest compiled insights from DB for the specific mode
    insights_list = await db.get_collection("insights")
    restaurant_insights = [i for i in insights_list if i.get("business_id") == business_id and i.get("mode", "all") == mode]
    
    # If no insights yet for this mode
    if not restaurant_insights:
        if mode != "all":
            # No insights in the selected window — return None instead of triggering generation
            return {
                "restaurant_name": business["name"],
                "insights": None
            }
        # "all" mode with no insights at all — run a quick analysis to bootstrap
        try:
            fresh_insights = await analysis_agent.generate_restaurant_insights(business_id, mode="all")
            return {
                "restaurant_name": business["name"],
                "insights": fresh_insights
            }
        except Exception as e:
            raise HTTPException(status_code=503, detail=str(e))
        
    # Return latest compiled insights for this mode
    latest = sorted(restaurant_insights, key=lambda x: x.get("generated_date", ""), reverse=True)[0]
    return {
        "restaurant_name": business["name"],
        "insights": latest
    }

@router.post("/{slug}/trigger")
async def trigger_insights_recompilation(slug: str, mode: str = "all"):
    """Force recompiles all review analytics and weekly recommendations for the selected time window."""
    business = await db.find_one("businesses", {"slug": slug})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
        
    business_id = business["id"]
    
    # Execute RAG Analysis Agent
    try:
        fresh_insights = await analysis_agent.generate_restaurant_insights(business_id, mode=mode)
        
        return {
            "message": "Aggregated reviews and compiled fresh RAG insights successfully.",
            "insights": fresh_insights
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))
