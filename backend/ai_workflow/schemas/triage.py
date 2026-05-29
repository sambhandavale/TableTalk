from pydantic import BaseModel
from typing import Optional

class StructuredTriageOutput(BaseModel):
    segment: str  # "Happy Regular" | "At-Risk" | "Lost/Unhappy" | "New Customer"
    route: str  # "public" | "private_alarm"
    google_redirect: bool
    reward_code: Optional[str] = None
    alert_owner: bool
    apology_draft: Optional[str] = None
