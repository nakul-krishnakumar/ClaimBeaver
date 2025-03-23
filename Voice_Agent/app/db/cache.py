import json
import logging
import redis
from app.core.config import settings

logger = logging.getLogger("app")

# Create Redis connection
redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    # password=settings.REDIS_PASSWORD,
    decode_responses=True
)

def get_cached_user(user_id: int) -> dict:
    """
    Get user data from Redis cache
    """
    try:
        user_data = redis_client.get(f"user:{user_id}")
        if user_data:
            logger.info(f"Cache hit for user:{user_id}")
            return json.loads(user_data)
        logger.info(f"Cache miss for user:{user_id}")
        return None
    except redis.RedisError as e:
        logger.error(f"Redis error: {e}")
        return None

def cache_user(user_id: int, user_data: dict) -> bool:
    """
    Cache user data in Redis
    """
    try:
        redis_client.setex(
            f"user:{user_id}", 
            settings.REDIS_CACHE_EXPIRATION, 
            json.dumps(user_data)
        )
        logger.info(f"Cached user:{user_id}")
        return True
    except redis.RedisError as e:
        logger.error(f"Redis error: {e}")
        return False

def invalidate_user_cache(user_id: int) -> bool:
    """
    Remove user data from Redis cache
    """
    try:
        redis_client.delete(f"user:{user_id}")
        logger.info(f"Invalidated cache for user:{user_id}")
        return True
    except redis.RedisError as e:
        logger.error(f"Redis error: {e}")
        return False