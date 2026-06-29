from pydantic_settings import BaseSettings
from app.core.config import settings

class AIConfig(BaseSettings):
    # Model definitions
    GEMINI_MODEL: str = "gemini-2.5-flash"
    TEMPERATURE: float = 0.2
    
    # API keys
    GEMINI_API_KEY: str = settings.GEMINI_API_KEY

    class Config:
        env_file = ".env"
        extra = "ignore"

ai_config = AIConfig()
