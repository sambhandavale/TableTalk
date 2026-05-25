from pydantic import BaseModel
from typing import Optional

class RestaurantOnboardRequest(BaseModel):
    name: str
    cuisine: str
    location: str
    owner_contact: str
    maps_url: str
    seating_capacity: Optional[int] = 30
