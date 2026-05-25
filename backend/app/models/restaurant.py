from pydantic import BaseModel, Field
from typing import Optional

class RestaurantDB(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    name: str
    cuisine: str
    location: str
    owner_contact: str
    maps_url: str
    seating_capacity: int = 30
    slug: str
    health_score: int = 0
    audit_completed: bool = False
