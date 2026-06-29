from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class BusinessOnboardRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    cuisine: str
    location: str
    owner_contact: str
    maps_url: str
    seating_capacity: Optional[int] = 30

class BusinessProfileUpdateRequest(BaseModel):
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
    has_incentives: Optional[bool] = False
    coupons: list = Field(default_factory=list)

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class AccountResponse(BaseModel):
    email: str
    role: str
    owner_contact: str

class BusinessResponse(BaseModel):
    id: Optional[str] = None
    name: str
    slug: str
    cuisine: str
    location: str
    maps_url: str

class OnboardResponse(BaseModel):
    message: str
    business: dict
    account: AccountResponse
    access_token: str
    token_type: str
    wow_moment_ready: bool

class LoginResponse(BaseModel):
    message: str
    user: AccountResponse
    business: BusinessResponse
    access_token: str
    token_type: str

