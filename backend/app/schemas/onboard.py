from pydantic import BaseModel
from typing import Optional

class RestaurantOnboardRequest(BaseModel):
    email: str
    password: str
    name: str
    cuisine: str
    location: str
    owner_contact: str
    maps_url: str
    seating_capacity: Optional[int] = 30

class RestaurantProfileUpdateRequest(BaseModel):
    contact_phone: Optional[str] = ""
    business_hours: Optional[str] = "12:00 PM - 11:30 PM"
    cost_for_two: Optional[int] = 1200
    pos_system: Optional[str] = "Excel/Manual"
    instagram_handle: Optional[str] = ""
    website_url: Optional[str] = ""
    dining_duration_mins: Optional[int] = 60
    is_pure_veg: Optional[bool] = False
    valet_parking: Optional[bool] = False
    seating_capacity: Optional[int] = 60

class UserLoginRequest(BaseModel):
    email: str
    password: str

