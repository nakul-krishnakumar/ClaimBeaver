import logging
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.db.models import User
from app.db.cache import get_cached_user, cache_user, invalidate_user_cache
from app.schemas.user import UserCreate, UserUpdate

logger = logging.getLogger("app")

def get_user_by_phone(db: Session, phone_number: str):
    """
    Get a user by phone number, checking cache first then database
    """
    # We'll use the phone number as the cache key
    cached_user = get_cached_user(f"phone:{phone_number}")
    if cached_user:
        return cached_user
    
    # Get from database if not in cache
    try:
        user = db.query(User).filter(User.phone_number == phone_number).first()
        if user:
            # Cache the user data
            user_data = {
                "id": user.id,
                "name": user.name,
                "phone_number": user.phone_number,
                "dob": user.dob,
                "insurance_type": user.insurance_type,
                "created_at": user.created_at.isoformat(),
                "updated_at": user.updated_at.isoformat() if user.updated_at else None
            }
            cache_user(f"phone:{phone_number}", user_data)
            return user
        return None
    except SQLAlchemyError as e:
        logger.error(f"Database error: {e}")
        return None

def get_user_by_id(db: Session, user_id: int):
    """
    Get a user by ID, checking cache first then database
    """
    # Try to get user from cache
    cached_user = get_cached_user(f"id:{user_id}")
    if cached_user:
        return cached_user
    
    # Get from database if not in cache
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            # Cache the user data
            user_data = {
                "id": user.id,
                "name": user.name,
                "phone_number": user.phone_number,
                "dob": user.dob,
                "insurance_type": user.insurance_type,
                "created_at": user.created_at.isoformat(),
                "updated_at": user.updated_at.isoformat() if user.updated_at else None
            }
            cache_user(f"id:{user_id}", user_data)
            # Also cache by phone number for lookup
            cache_user(f"phone:{user.phone_number}", user_data)
            return user
        return None
    except SQLAlchemyError as e:
        logger.error(f"Database error: {e}")
        return None

def create_user(db: Session, user: UserCreate):
    """
    Create a new user in the database
    """
    try:
        # Check if a user with this phone number already exists
        existing_user = db.query(User).filter(User.phone_number == user.phone_number).first()
        if existing_user:
            logger.info(f"User with phone number {user.phone_number} already exists")
            return existing_user
            
        # Create new user
        db_user = User(
            name=user.name,
            phone_number=user.phone_number,
            dob=user.dob,
            insurance_type=user.insurance_type
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        # Cache the new user
        user_data = {
            "id": db_user.id,
            "name": db_user.name,
            "phone_number": db_user.phone_number,
            "dob": db_user.dob,
            "insurance_type": db_user.insurance_type,
            "created_at": db_user.created_at.isoformat(),
            "updated_at": db_user.updated_at.isoformat() if db_user.updated_at else None
        }
        cache_user(f"id:{db_user.id}", user_data)
        cache_user(f"phone:{db_user.phone_number}", user_data)
        
        return db_user
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error: {e}")
        return None

def update_user(db: Session, user_id: int, user: UserUpdate):
    """
    Update an existing user
    """
    try:
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            return None
        
        # Cache the old phone number for invalidation
        old_phone = db_user.phone_number
            
        for key, value in user.model_dump(exclude_unset=True).items():
            setattr(db_user, key, value)
            
        db.commit()
        db.refresh(db_user)
        
        # Invalidate cache for both ID and phone number
        invalidate_user_cache(f"id:{user_id}")
        invalidate_user_cache(f"phone:{old_phone}")
        
        # If phone number changed, invalidate that too
        if old_phone != db_user.phone_number:
            invalidate_user_cache(f"phone:{db_user.phone_number}")
        
        return db_user
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Database error: {e}")
        return None

def get_default_user():
    """
    Return default user for backward compatibility
    """
    return {
        "customer_name": "Dead Man",
        "flag": "false"
    }

def process_user_details(data):
    """
    Process user details request data
    """
    return data.get("args", {})