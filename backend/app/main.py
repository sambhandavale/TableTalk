import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

from app.database import db
from app.core.config import settings
from app.routes import onboard, reviews, insights, campaigns, dashboard, search

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to MongoDB or JSON fallback on startup
    await db.connect()
    
    try:
        yield
    finally:
        # Disconnect/Cleanup if required
        if db.client:
            db.client.close()

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered Customer Intelligence & Retention Platform Backend",
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# Configure CORS for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon simplicity; adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root API router
api_router = APIRouter(prefix="/api")

# Register routers
api_router.include_router(onboard.router)
api_router.include_router(reviews.router)
api_router.include_router(insights.router)
api_router.include_router(campaigns.router)
api_router.include_router(dashboard.router)
api_router.include_router(search.router)

# Mount all under main app
app.include_router(api_router)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "mongodb_connected": db.is_mongodb_connected,
        "database_type": "MongoDB" if db.is_mongodb_connected else "Local File JSON (Resilient Fallback)"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
