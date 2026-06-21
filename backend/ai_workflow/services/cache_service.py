import redis.asyncio as redis
import json
import hashlib
import logging
import os

logger = logging.getLogger("TableTalk.CacheService")

class SemanticCacheService:
    def __init__(self):
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        try:
            self.redis = redis.from_url(redis_url, decode_responses=True)
            logger.info("Connected to Redis for Semantic Caching")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            self.redis = None

    def _generate_key(self, prefix: str, data: dict) -> str:
        """Creates a stable hash key from dictionary data."""
        stable_str = json.dumps(data, sort_keys=True)
        hash_digest = hashlib.sha256(stable_str.encode("utf-8")).hexdigest()
        return f"ttcache:{prefix}:{hash_digest}"

    async def get_cached_insight(self, prefix: str, query_data: dict):
        if not self.redis:
            return None
        key = self._generate_key(prefix, query_data)
        try:
            cached = await self.redis.get(key)
            if cached:
                logger.info(f"Cache HIT for prefix {prefix}")
                return json.loads(cached)
            return None
        except Exception as e:
            logger.error(f"Redis get error: {e}")
            return None

    async def set_cached_insight(self, prefix: str, query_data: dict, result_data: dict, expire_seconds: int = 3600):
        if not self.redis:
            return
        key = self._generate_key(prefix, query_data)
        try:
            await self.redis.set(key, json.dumps(result_data), ex=expire_seconds)
            logger.info(f"Cache SET for prefix {prefix}")
        except Exception as e:
            logger.error(f"Redis set error: {e}")

cache_service = SemanticCacheService()
