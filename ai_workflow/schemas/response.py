from pydantic import BaseModel

class StructuredResponseOutput(BaseModel):
    sentiment: str  # "positive" | "negative" | "neutral"
    drafted_reply: str
