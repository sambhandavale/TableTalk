from pydantic import BaseModel
from typing import List, Optional

class QRReviewSubmitRequest(BaseModel):
    restaurant_slug: str
    rating: int
    text: str
    ordered_items: List[str]
    visitor_type: str  # "first-time" | "returning"
    diner_name: Optional[str] = "Anonymous"
    diner_phone: Optional[str] = None
    diner_email: Optional[str] = None

class VoiceExtractRequest(BaseModel):
    transcript: str
