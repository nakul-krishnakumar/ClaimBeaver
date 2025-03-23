import uvicorn
from app.api.routes.user_routes import router as user_router
from app.core.config import settings
from app.core.logging import configure_logging
from app.db.database import create_tables
from fastapi import FastAPI

# Configure logging
logger = configure_logging()

# Create FastAPI application
app = FastAPI(
    title="User Management API",
    description="API for managing user data with PostgreSQL and Redis caching",
    version="1.0.0"
)

# Include routers
app.include_router(user_router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up application")
    # Create database tables if they don't exist
    create_tables()
    logger.info("Database tables initialized")

@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=settings.DEBUG
    )