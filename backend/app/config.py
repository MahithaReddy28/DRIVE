import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "DRIVE - Disaster Supply Rerouting Engine"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # AI Provider settings
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "mock")  # mock, openai, gemini
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Default Disaster Zone (Chennai)
    DEFAULT_ZONE: str = "Chennai"
    DEFAULT_LAT: float = 13.0827
    DEFAULT_LNG: float = 80.2707
    
    # Disaster Simulation defaults
    DEFAULT_SAFETY_MARGIN_M: float = 0.3
    DEFAULT_FLOOD_LEVEL_M: float = 1.8
    
    class Config:
        case_sensitive = True

settings = Settings()
