from pydantic import BaseModel, Field
from typing import List, Optional

class VoiceExtractionOutput(BaseModel):
    diner_name: Optional[str] = Field(default="Anonymous", description="The name of the customer if mentioned in the transcript.")
    visitor_type: str = Field(default="first-time", description="Return status: 'first-time' or 'returning' if mentioned, default to 'first-time'.")
    ordered_items: List[str] = Field(default_factory=list, description="List of dishes, products, or services mentioned in the transcript.")
    cleaned_review_text: str = Field(description="The actual review part of the transcript, polished or verbatim, excluding the introductory name/visit parts.")
