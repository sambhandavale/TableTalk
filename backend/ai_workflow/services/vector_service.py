import chromadb
import logging
import os
from typing import List, Dict, Any

logger = logging.getLogger("TableTalk.VectorService")

class VectorService:
    def __init__(self):
        # We store the chroma database locally in the backend directory
        persist_directory = os.path.join(os.path.dirname(__file__), "..", "..", ".chroma_db")
        os.makedirs(persist_directory, exist_ok=True)
        
        try:
            self.client = chromadb.PersistentClient(path=persist_directory)
            self.collection = self.client.get_or_create_collection(
                name="reviews",
                metadata={"hnsw:space": "cosine"}
            )
            logger.info("ChromaDB Vector Service initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize ChromaDB: {e}")
            self.client = None
            self.collection = None

    def add_review(self, review_id: str, text: str, embedding: List[float], metadata: Dict[str, Any]):
        if not self.collection:
            logger.error("ChromaDB collection not available.")
            return False
            
        try:
            # Ensure metadata values are basic types supported by Chroma
            clean_metadata = {}
            for k, v in metadata.items():
                if v is None:
                    continue
                if isinstance(v, (str, int, float, bool)):
                    clean_metadata[k] = v
                else:
                    clean_metadata[k] = str(v)
                    
            self.collection.add(
                ids=[review_id],
                embeddings=[embedding],
                documents=[text],
                metadatas=[clean_metadata]
            )
            logger.info(f"Successfully added review {review_id} to Vector DB.")
            return True
        except Exception as e:
            logger.error(f"Failed to add review to Vector DB: {e}")
            return False

    def search_reviews(self, business_id: str, query_embedding: List[float], n_results: int = 5) -> Dict[str, Any]:
        if not self.collection:
            return {"documents": [], "metadatas": [], "distances": []}
            
        try:
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results,
                where={"business_id": business_id}
            )
            return results
        except Exception as e:
            logger.error(f"Failed to query Vector DB: {e}")
            return {"documents": [], "metadatas": [], "distances": []}

vector_service = VectorService()
