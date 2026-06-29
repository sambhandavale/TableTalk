from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Union
from datetime import datetime
from ai_workflow.schemas.analysis import ActionItem, WeeklyTrend, SentimentBreakdown, InsightThemes

class InsightDB(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    business_id: str
    generated_date: datetime
    health_trend: List[WeeklyTrend] = []
    sentiment: Optional[SentimentBreakdown] = None
    themes: InsightThemes
    health_score: int
    action_items: List[ActionItem] = []
