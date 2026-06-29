from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ReviewDB(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    business_id: str
    customer_id: Optional[str] = None
    source: str  # "qr" | "google"
    rating: int
    text: str
    ordered_items: List[str] = []
    visitor_type: str  # "first-time" | "returning"
    diner_name: str = "Anonymous"
    diner_phone: Optional[str] = None
    diner_email: Optional[str] = None
    timestamp: datetime
    owner_alerted: bool = False
    ai_apology_draft: Optional[str] = None
    ai_response_draft: Optional[str] = None
    owner_approved_reply: bool = False
    final_reply_content: Optional[str] = None
    status: str = "pending_triage"  # "pending_triage" | "triaged_positive" | "triaged_alarm"
