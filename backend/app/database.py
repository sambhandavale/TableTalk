import os
import json
import logging
import uuid
from typing import Dict, List, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("TableTalk.DB")

from app.core.config import settings

MONGO_URI = settings.MONGODB_URL
DB_NAME = settings.DATABASE_NAME

class ResilientDB:
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None
        self.is_mongodb_connected = False
        
        # Fallback local file storage
        self.fallback_file = "local_db_fallback.json"
        self.fallback_data: Dict[str, List[Any]] = {
            "businesses": [],
            "reviews": [],
            "insights": [],
            "campaigns": [],
            "customers": []
        }
        self._load_fallback_data()

    def _load_fallback_data(self):
        """Loads seeded fallback data from JSON if it exists, otherwise writes initial seed."""
        if os.path.exists(self.fallback_file):
            try:
                with open(self.fallback_file, "r") as f:
                    self.fallback_data = json.load(f)
                logger.info(f"Loaded fallback database from {self.fallback_file}")
            except Exception as e:
                logger.error(f"Failed to load fallback file: {e}")
        else:
            self._seed_fallback_data()

    def _save_fallback_data(self):
        """Saves current fallback data back to JSON."""
        try:
            with open(self.fallback_file, "w") as f:
                json.dump(self.fallback_data, f, indent=4)
        except Exception as e:
            logger.error(f"Failed to write to fallback file: {e}")

    def _seed_fallback_data(self):
        """Initializes empty fallback data."""
        self.fallback_data["businesses"] = []
        self.fallback_data["reviews"] = []
        self.fallback_data["insights"] = []
        self.fallback_data["campaigns"] = []
        self.fallback_data["customers"] = []
        self._save_fallback_data()
        logger.info(f"Seeded fallback database in {self.fallback_file}")

    async def connect(self):
        """Asynchronously connect to MongoDB, falling back to JSON storage on failure."""
        try:
            logger.info(f"Attempting to connect to MongoDB at {MONGO_URI}...")
            self.client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=2000)
            # Force server check
            await self.client.admin.command('ping')
            self.db = self.client[DB_NAME]
            self.is_mongodb_connected = True
            logger.info("Successfully connected to MongoDB!")
        except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
            logger.warning(f"MongoDB connection failed: {e}. Falling back to JSON local file database.")
            self.is_mongodb_connected = False
            self.db = None

    # Database API Emulations
    async def get_collection(self, collection_name: str) -> List[Dict[str, Any]]:
        if self.is_mongodb_connected and self.db is not None:
            cursor = self.db[collection_name].find({})
            docs = await cursor.to_list(length=None)
            for doc in docs:
                if "_id" in doc:
                    doc["_id"] = str(doc["_id"])
            return docs
        return self.fallback_data.get(collection_name, [])

    async def insert_one(self, collection_name: str, document: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in document and "_id" not in document:
            document["id"] = str(uuid.uuid4())
            
        if self.is_mongodb_connected and self.db is not None:
            await self.db[collection_name].insert_one(document)
            # Remove motor _id to make it serializable easily
            if "_id" in document:
                document["_id"] = str(document["_id"])
            return document
        
        # Local JSON fallback
        if collection_name not in self.fallback_data:
            self.fallback_data[collection_name] = []
        self.fallback_data[collection_name].append(document)
        self._save_fallback_data()
        return document

    async def insert_many(self, collection_name: str, documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        if not documents:
            return []
            
        for doc in documents:
            if "id" not in doc and "_id" not in doc:
                doc["id"] = str(uuid.uuid4())
                
        if self.is_mongodb_connected and self.db is not None:
            await self.db[collection_name].insert_many(documents)
            for doc in documents:
                if "_id" in doc:
                    doc["_id"] = str(doc["_id"])
            return documents
            
        # Local JSON fallback
        if collection_name not in self.fallback_data:
            self.fallback_data[collection_name] = []
        self.fallback_data[collection_name].extend(documents)
        self._save_fallback_data()
        return documents

    async def find_one(self, collection_name: str, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if self.is_mongodb_connected and self.db is not None:
            doc = await self.db[collection_name].find_one(query)
            if doc and "_id" in doc:
                doc["_id"] = str(doc["_id"])
            return doc
            
        # Local JSON fallback query emulation
        items = self.fallback_data.get(collection_name, [])
        for item in items:
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                return item
        return None

    async def find_many(self, collection_name: str, query: Dict[str, Any], skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        if self.is_mongodb_connected and self.db is not None:
            cursor = self.db[collection_name].find(query).skip(skip).limit(limit)
            docs = await cursor.to_list(length=None)
            for doc in docs:
                if "_id" in doc:
                    doc["_id"] = str(doc["_id"])
            return docs
            
        items = self.fallback_data.get(collection_name, [])
        results = []
        for item in items:
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                results.append(item)
        return results[skip:skip+limit]

    async def count(self, collection_name: str, query: Dict[str, Any]) -> int:
        if self.is_mongodb_connected and self.db is not None:
            return await self.db[collection_name].count_documents(query)
            
        items = self.fallback_data.get(collection_name, [])
        count = 0
        for item in items:
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                count += 1
        return count

    async def update_one(self, collection_name: str, query: Dict[str, Any], update: Dict[str, Any]) -> bool:
        if self.is_mongodb_connected and self.db is not None:
            result = await self.db[collection_name].update_one(query, update)
            return result.modified_count > 0
            
        # Local JSON fallback emulation
        items = self.fallback_data.get(collection_name, [])
        for idx, item in enumerate(items):
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                # Apply simple update fields (handles $set operators)
                if "$set" in update:
                    items[idx].update(update["$set"])
                else:
                    # If it's just a direct dict without operators
                    # Check if it has any $ operators to avoid overriding incorrectly
                    has_ops = any(k.startswith('$') for k in update.keys())
                    if not has_ops:
                        items[idx].update(update)
                
                # Apply $inc support
                if "$inc" in update:
                    for k, v in update["$inc"].items():
                        items[idx][k] = items[idx].get(k, 0) + v
                        
                self._save_fallback_data()
                return True
        return False

    async def delete_many(self, collection_name: str, query: Dict[str, Any]) -> int:
        if self.is_mongodb_connected and self.db is not None:
            result = await self.db[collection_name].delete_many(query)
            return result.deleted_count
            
        # Local JSON fallback emulation
        items = self.fallback_data.get(collection_name, [])
        initial_count = len(items)
        new_items = []
        for item in items:
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if not match:
                new_items.append(item)
                
        self.fallback_data[collection_name] = new_items
        deleted = initial_count - len(new_items)
        if deleted > 0:
            self._save_fallback_data()
        return deleted

    async def aggregate(self, collection_name: str, pipeline: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        if self.is_mongodb_connected and self.db is not None:
            cursor = self.db[collection_name].aggregate(pipeline)
            docs = await cursor.to_list(length=None)
            for doc in docs:
                if "_id" in doc:
                    doc["_id"] = str(doc["_id"])
            return docs
        # Local JSON fallback does not natively support aggregation pipelines
        return []

# Global database instance
db = ResilientDB()
