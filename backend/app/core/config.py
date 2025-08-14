from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Database
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "paisasplit"

    # Security
    secret_key: str = "your-secret-key-here-please-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Application
    app_name: str = "PaisaSplit API"
    app_version: str = "1.0.0"
    debug: bool = True

    # CORS
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:8081",
        "exp://localhost:8081",
    ]

    class Config:
        env_file = ".env"


settings = Settings()
