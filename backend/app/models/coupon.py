from pydantic import BaseModel, Field
from typing import Optional

class CouponDB(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    business_id: str
    discount_amount: str
    coupon_code: str
    quantity: Optional[str] = ""
    target_sentiment: Optional[str] = "all"
    is_active: Optional[bool] = True
