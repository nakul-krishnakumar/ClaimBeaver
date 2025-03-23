import os
from pydantic import Field
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # App settings
    APP_ENV: str = Field(default="development")
    DEBUG: bool = Field(default=True)
    LOG_LEVEL: str = Field(default="INFO")
    
    # Database settings
    DATABASE_URL: str = Field(default=os.getenv("DATABASE_URL"))
    
    # Redis settings
    REDIS_HOST: str = Field(default=os.getenv("REDIS_HOST", "localhost"))
    REDIS_PORT: int = Field(default=int(os.getenv("REDIS_PORT", 6379)))
    REDIS_DB: int = Field(default=int(os.getenv("REDIS_DB", 0)))
    REDIS_PASSWORD: str = Field(default=os.getenv("REDIS_PASSWORD", ""))
    REDIS_CACHE_EXPIRATION: int = Field(default=3600)  # 1 hour in seconds

    # New: Retell API settings
    RETELL_API_KEY: str = Field("", env="RETELL_API_KEY")
    RETELL_API_URL: str = Field("https://api.retell.cc", env="RETELL_API_URL")
    RETELL_WEBHOOK_SECRET: str = Field("", env="RETELL_WEBHOOK_SECRET")

settings = Settings()