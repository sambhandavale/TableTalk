import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "TableTalk API"
    APP_VERSION: str = "1.0.0"
    
    # MongoDB settings
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "tabletalk")
    
    # Gemini AI Key
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Third-Party Scraper API Keys
    APIFY_API_TOKEN: str = os.getenv("APIFY_API_TOKEN", "")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
