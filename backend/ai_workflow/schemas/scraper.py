from pydantic import BaseModel
from typing import List

class ScrapedReview(BaseModel):
    rating: int
    text: str
    ordered_items: List[str]
    visitor_type: str  # "first-time" | "returning"
    diner_name: str
    timestamp: str  # ISO 8601 string, e.g., "2026-05-20T19:30:00Z"

class ScraperStructuredOutput(BaseModel):
    reviews: List[ScrapedReview]
