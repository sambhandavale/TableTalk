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
    
    # Advanced Profile Operations Metrics
    contact_phone: Optional[str] = ""
    business_hours: Optional[str] = "12:00 PM - 11:30 PM"
    cost_for_two: Optional[int] = 1200
    pos_system: Optional[str] = "Excel/Manual"
    instagram_handle: Optional[str] = ""
    website_url: Optional[str] = ""
    dining_duration_mins: Optional[int] = 60
    is_pure_veg: Optional[bool] = False
    valet_parking: Optional[bool] = False
