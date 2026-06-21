from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Dict, Any
from ai_workflow.services.vector_service import vector_service
from ai_workflow.services.embedding_service import embedding_service

router = APIRouter(prefix="/search", tags=["Semantic Search"])

@router.get("/{business_id}")
async def semantic_search(business_id: str, query: str = Query(..., description="The semantic search query")):
    """
    Performs a semantic search against the Vector DB for a specific business.
    This is the foundation for the future Restaurant Owner Chatbot RAG system!
    """
    if not query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
        
    try:
        query_embeddings = await embedding_service.generate_embeddings([query])
        
        if not query_embeddings:
            raise HTTPException(status_code=500, detail="Failed to generate query embedding")
            
        results = vector_service.search_reviews(business_id, query_embeddings[0], n_results=5)
        
        formatted_results = []
        if results.get("documents") and len(results["documents"]) > 0:
            for i in range(len(results["documents"][0])):
                formatted_results.append({
                    "text": results["documents"][0][i],
                    "metadata": results["metadatas"][0][i],
                    "distance": results["distances"][0][i]
                })
                
        return {
            "query": query,
            "business_id": business_id,
            "results": formatted_results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
