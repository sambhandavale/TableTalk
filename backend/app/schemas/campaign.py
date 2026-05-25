from pydantic import BaseModel

class LaunchCampaignRequest(BaseModel):
    segment: str  # "Happy Regular" | "At-Risk" | "Lost/Unhappy" | "New Customer"
    message: str
    coupon_code: str
    discount_pct: int = 15
