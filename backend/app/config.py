import os
from pathlib import Path

from dotenv import load_dotenv

env_path = Path(__file__).resolve().parents[1] / ".env"
if env_path.exists():
    load_dotenv(env_path)


def env_bool(name, default=False):
    value = os.getenv(name)
    if value is None:
        return default

    return value.strip().lower() in {"1", "true", "yes", "on"}


class Config:
    FLASK_DEBUG = env_bool("FLASK_DEBUG", False)
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://root:password@localhost:3306/mathbank",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TEACHER_ACCESS_CODE = os.getenv("TEACHER_ACCESS_CODE", "ABC123")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
    FRONTEND_ORIGINS = [
        origin.strip().rstrip("/")
        for origin in os.getenv(
            "FRONTEND_ORIGINS",
            f"{FRONTEND_URL},http://127.0.0.1:5173",
        ).split(",")
        if origin.strip()
    ]

    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = os.getenv(
        "SESSION_COOKIE_SAMESITE",
        "Lax" if FLASK_DEBUG else "None",
    )
    SESSION_COOKIE_SECURE = env_bool("SESSION_COOKIE_SECURE", not FLASK_DEBUG)

    REMEMBER_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_SAMESITE = os.getenv(
        "REMEMBER_COOKIE_SAMESITE",
        SESSION_COOKIE_SAMESITE,
    )
    REMEMBER_COOKIE_SECURE = env_bool("REMEMBER_COOKIE_SECURE", SESSION_COOKIE_SECURE)
