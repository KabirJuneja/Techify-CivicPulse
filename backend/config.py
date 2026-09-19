import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    API_NAME: str = os.getenv("VITE_API_NAME", "NAGAR-X FastAPI Civic Services Engine")
    API_VERSION: str = "2.0.0"
    API_URL: str = os.getenv("VITE_API_URL", "http://localhost:8000")
    PORT: int = int(os.getenv("PORT", "8000"))
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"
    ]

settings = Settings()
