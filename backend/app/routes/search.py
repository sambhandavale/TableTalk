from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any
from app.database import db
from ai_workflow.services.embedding_service import embedding_service

router = APIRouter(prefix="/search", tags=["Semantic Search"])

@router.get("/{business_id}")
async def semantic_search(business_id: str, query: str = Query(..., description="The semantic search query")):
    """
    Performs a semantic search against the Vector DB for a specific business.
    This uses MongoDB Atlas Native Vector Search ($vectorSearch).
    """
    if not query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
        
    try:
        query_embeddings = await embedding_service.generate_embeddings([query])
        
        if not query_embeddings or len(query_embeddings) == 0:
            raise HTTPException(status_code=500, detail="Failed to generate query embedding")
            
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index",
                    "path": "embedding",
                    "queryVector": query_embeddings[0],
                    "numCandidates": 100,
                    "limit": 5,
                    "filter": {"business_id": business_id}
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "text": 1,
                    "rating": 1,
                    "visitor_type": 1,
                    "timestamp": 1,
                    "score": {"$meta": "vectorSearchScore"}
                }
            }
        ]
        
        results = await db.aggregate("reviews", pipeline)
        
        formatted_results = []
        for r in results:
            formatted_results.append({
                "text": r.get("text", ""),
                "metadata": {
                    "rating": r.get("rating"),
                    "visitor_type": r.get("visitor_type"),
                    "timestamp": r.get("timestamp")
                },
                "distance": r.get("score", 0)
            })
                
        return {
            "query": query,
            "business_id": business_id,
            "results": formatted_results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
