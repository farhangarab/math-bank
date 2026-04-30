import os
from pathlib import Path

from dotenv import load_dotenv

env_path = Path(__file__).resolve().parents[1] / ".env"
if env_path.exists():
    load_dotenv(env_path)


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TEACHER_ACCESS_CODE = os.getenv("TEACHER_ACCESS_CODE", "ABC123")
    FRONTEND_URL = os.getenv("FRONTEND_URL")
    FRONTEND_ORIGINS = [
        origin.strip()
        for origin in os.getenv(
            "FRONTEND_ORIGINS",
            f"{FRONTEND_URL},http://127.0.0.1:5173",
        ).split(",")
        if origin.strip()
    ]
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "False").lower() == "true"

    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = False

    REMEMBER_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_SAMESITE = "Lax"
    REMEMBER_COOKIE_SECURE = False
