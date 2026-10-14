"""Local development settings."""
from .base import *  # noqa: F403

DEBUG = env.bool("DEBUG", default=True)  # noqa: F405

# Allow local frontend during development
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ALLOW_CREDENTIALS = True

# Fallback to in-memory SQLite if PostgreSQL is not available in local test mode
if env.str("USE_SQLITE", default="False").lower() in ("true", "1"):  # noqa: F405
    DATABASES = {  # noqa: F405
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": ":memory:",
        }
    }
