import os
import json
import logging
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
        """Seed initial high-quality Mumbai business demo data."""
        self.fallback_data["businesses"] = [
            {
                "id": "mumbai-masala-bandra",
                "name": "Mumbai Masala Bistro",
                "cuisine": "Indian Fusion",
                "slug": "mumbai-masala-bandra",
                "maps_url": "https://maps.google.com/?cid=mock-mumbai-masala",
                "owner_contact": "owner@mumbaimasala.in",
                "health_score": 82
            }
        ]
        self.fallback_data["reviews"] = [
            {
                "id": "rev-1",
                "business_id": "mumbai-masala-bandra",
                "source": "google",
                "rating": 5,
                "text": "The Mutton Biryani was exceptionally soft and aromatic. Highly recommend!",
                "ordered_items": ["Mutton Biryani"],
                "visitor_type": "returning",
                "timestamp": "2026-05-24T12:00:00Z"
            },
            {
                "id": "rev-2",
                "business_id": "mumbai-masala-bandra",
                "source": "google",
                "rating": 2,
                "text": "Naan was cold and rubbery, took 25 minutes to arrive. Butter chicken was good though.",
                "ordered_items": ["Butter Chicken & Naan"],
                "visitor_type": "first-time",
                "timestamp": "2026-05-23T14:30:00Z"
            }
        ]
        self.fallback_data["insights"] = [
            {
                "id": "ins-1",
                "business_id": "mumbai-masala-bandra",
                "generated_date": "2026-05-25T00:00:00Z",
                "themes": {
                    "praised": ["Mutton Biryani", "Butter Chicken"],
                    "complaints": ["Cold Naan", "Slow Service"]
                },
                "health_score": 82,
                "action_items": [
                    "Highlight Biryani as signature dish on Google Maps.",
                    "Review tandoor-to-table pathway for cold Naan alerts."
                ]
            }
        ]
        self.fallback_data["campaigns"] = [
            {
                "id": "camp-1",
                "business_id": "mumbai-masala-bandra",
                "segment": "Lost/Unhappy",
                "message": "We have improved! Get a free Butter Naan on your next order.",
                "sent_count": 0,
                "redemption_count": 0
            }
        ]
        self.fallback_data["customers"] = [
            {
                "phone": "+919876543210",
                "business_id": "mumbai-masala-bandra",
                "visit_count": 3,
                "last_visit": "2026-05-24T12:00:00Z",
                "segment": "Happy Regular"
            }
        ]
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
            docs = await cursor.to_list(length=1000)
            for doc in docs:
                if "_id" in doc:
                    doc["_id"] = str(doc["_id"])
            return docs
        return self.fallback_data.get(collection_name, [])

    async def insert_one(self, collection_name: str, document: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in document and "_id" not in document:
            document["id"] = f"{collection_name[:4]}-{int(os.urandom(4).hex(), 16) % 100000}"
            
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
                doc["id"] = f"{collection_name[:4]}-{int(os.urandom(4).hex(), 16) % 100000}"
                
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
                set_fields = update.get("$set", update)
                items[idx].update(set_fields)
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

# Global database instance
db = ResilientDB()
