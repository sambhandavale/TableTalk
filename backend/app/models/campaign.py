from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class CampaignDB(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    business_id: str
    segment: str  # "Happy Regular" | "At-Risk" | "Lost/Unhappy" | "New Customer"
    message: str
    coupon_code: str
    discount_pct: int = 15
    sent_count: int = 0
    recipient_ids: List[str] = Field(default_factory=list)
    redemption_count: int = 0
    status: str = "launched"
    timestamp: datetime
