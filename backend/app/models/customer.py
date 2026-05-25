from pydantic import BaseModel, Field
from typing import Optional

class CustomerDB(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    phone: str
    restaurant_id: str
    visit_count: int = 1
    last_visit: str
    segment: str  # "Happy Regular" | "At-Risk" | "Lost/Unhappy" | "New Customer"
