from pydantic import BaseModel, Field
from typing import Optional

class CampaignDB(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    restaurant_id: str
    segment: str  # "Happy Regular" | "At-Risk" | "Lost/Unhappy" | "New Customer"
    message: str
    coupon_code: str
    discount_pct: int = 15
    sent_count: int = 0
    redemption_count: int = 0
    status: str = "launched"
    timestamp: str
