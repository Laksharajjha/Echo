from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite+aiosqlite:///./echo.db"
    ANTHROPIC_API_KEY: str = ""
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    SIMULATION_TICK_MINUTES: int = 5
    DEBUG: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
