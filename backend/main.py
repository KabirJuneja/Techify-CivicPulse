from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.routers import ai, tickets, analytics

app = FastAPI(
    title=settings.API_NAME,
    version=settings.API_VERSION,
    description="High-performance Python FastAPI backend for NAGAR-X Ahmedabad Municipal Civic Platform.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(ai.router)
app.include_router(tickets.router)
app.include_router(analytics.router)

@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.API_NAME}",
        "version": settings.API_VERSION,
        "docs": "/docs",
        "status": "Online & Serving Requests"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "service": settings.API_NAME,
        "version": settings.API_VERSION,
        "framework": "FastAPI (Python 3.14)",
        "geminiConfigured": bool(settings.GEMINI_API_KEY)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
