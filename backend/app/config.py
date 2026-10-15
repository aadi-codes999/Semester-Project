import os
from dotenv import load_dotenv


load_dotenv()


class Config:
    """Runtime configuration loaded from environment variables."""

    SECRET_KEY = os.getenv("SECRET_KEY", "development-only-change-me")
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///gis_village.db")
