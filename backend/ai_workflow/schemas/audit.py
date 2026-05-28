from pydantic import BaseModel
from typing import List

class ComplaintItem(BaseModel):
    issue: str
    impact: str  # "Low" | "Medium" | "High"

class StructuredAuditOutput(BaseModel):
    health_score: int
    praised: List[str]
    complaints: List[ComplaintItem]
    action_items: List[str]
