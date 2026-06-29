from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class QRReviewSubmitRequest(BaseModel):
    restaurant_slug: str
    rating: int = Field(ge=1, le=5)
    text: str
    ordered_items: List[str]
    visitor_type: Literal["first-time", "returning"]
    diner_name: Optional[str] = "Anonymous"
    diner_phone: Optional[str] = None
    diner_email: Optional[str] = None
    diner_birthdate: Optional[str] = None

class VoiceExtractRequest(BaseModel):
    transcript: str
