from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class ThemeInsights(BaseModel):
    praised: List[str] = []
    complaints: List[str] = []

class InsightDB(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    restaurant_id: str
    generated_date: str
    themes: ThemeInsights
    health_score: int
    action_items: List[str] = []
