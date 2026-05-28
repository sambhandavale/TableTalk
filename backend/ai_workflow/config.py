import os
from app.core.config import settings

class AIConfig:
    # Model definitions
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    TEMPERATURE: float = 0.2
    
    # API keys
    GEMINI_API_KEY: str = settings.GEMINI_API_KEY

ai_config = AIConfig()
