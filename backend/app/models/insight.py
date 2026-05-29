from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Union

class ThemeComplaintItem(BaseModel):
    issue: str
    impact: str  # "Low" | "Medium" | "High"

class ThemeInsights(BaseModel):
    praised: List[str] = []
    complaints: List[Union[str, ThemeComplaintItem]] = []

class InsightDB(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    business_id: str
    generated_date: str
    themes: ThemeInsights
    health_score: int
    action_items: List[str] = []
