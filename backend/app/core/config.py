from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "TableTalk API"
    APP_VERSION: str = "1.0.0"
    
    # MongoDB settings
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "tabletalk"
    
    # Gemini AI Key
    GEMINI_API_KEY: str = ""
    
    # Third-Party Scraper API Keys
    APIFY_API_TOKEN: str = ""

    # Auth Settings
    JWT_SECRET: str = "super-secret-default-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
