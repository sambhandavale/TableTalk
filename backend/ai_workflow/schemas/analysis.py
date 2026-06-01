from pydantic import BaseModel, Field
from typing import List, Literal

class WeeklyTrend(BaseModel):
    week: str
    score: int

class SentimentBreakdown(BaseModel):
    positive: int
    neutral: int
    negative: int

class InsightThemes(BaseModel):
    praised: List[str] = Field(description="Top 5 praised food items, services, or atmosphere aspects.")
    complaints: List[str] = Field(description="Top 5 specific complaints or frequent issues.")
    temporal_trends: str = Field(description="A brief sentence describing any time-based patterns (e.g., 'Dinner rushes see slower service', 'Weekends are rated higher').")

class ActionItem(BaseModel):
    category: Literal["food", "service", "operations", "marketing"] = Field(description="Category of the insight.")
    title: str = Field(description="A short, punchy title for the recommendation.")
    description: str = Field(description="A highly specific, actionable operational recommendation.")
    source_review_ids: List[str] = Field(description="List of exact MongoDB review IDs that triggered this recommendation. Must be pulled directly from the provided review data.", default=[])

class AIInsightsOutput(BaseModel):
    health_trend_data: List[WeeklyTrend] = Field(description="8 items representing the last 8 weeks of health scores, from 'W1' to 'Current'")
    sentiment_data: SentimentBreakdown = Field(description="Percentages of positive, neutral, and negative reviews that add up to 100")
    themes: InsightThemes = Field(description="Diverse themes and temporal analysis extracted from the reviews.")
    health_score: int = Field(description="Current overall health score out of 100")
    action_items: List[ActionItem] = Field(description="List of exactly 4 diverse action items across different categories.")
