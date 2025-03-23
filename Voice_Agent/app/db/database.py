import logging
from sqlalchemy import create_engine, inspect
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Create SQLAlchemy engine
engine = create_engine(settings.DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Logger
logger = logging.getLogger("app")

def get_db():
    """
    Dependency for database session. Use with FastAPI dependency injection.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """
    Create tables in the database if they don't exist.
    """
    # Import models to ensure they're registered with Base
    from app.db.models import User  # noqa
    
    inspector = inspect(engine)
    
    if not inspector.has_table("users"):
        logger.info("Creating users table")
        Base.metadata.create_all(bind=engine)
        logger.info("Users table created")
    else:
        logger.info("Users table already exists")