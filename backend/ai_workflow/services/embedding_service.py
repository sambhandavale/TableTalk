import logging
import numpy as np
from sklearn.cluster import KMeans
from typing import List, Dict, Any
from ai_workflow.services.llm_service import llm_service

logger = logging.getLogger("TableTalk.EmbeddingService")

class EmbeddingService:
    def __init__(self):
        self.client = llm_service.client
        self.model = "text-embedding-004"

    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        if not self.client or not texts:
            return []
        try:
            import asyncio
            def run_embed():
                response = self.client.models.embed_content(
                    model=self.model,
                    contents=texts
                )
                return [e.values for e in response.embeddings]

            loop = asyncio.get_running_loop()
            embeddings = await loop.run_in_executor(None, run_embed)
            return embeddings
        except Exception as e:
            logger.error(f"Failed to generate embeddings: {e}")
            return []

    def extract_exemplars(self, items: List[Dict[str, Any]], embeddings: List[List[float]], max_clusters: int = 5) -> List[Dict[str, Any]]:
        if not items or not embeddings or len(items) != len(embeddings):
            return items

        n_clusters = min(len(items), max_clusters)
        if n_clusters <= 1:
            return items

        X = np.array(embeddings)
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        kmeans.fit(X)

        exemplars = []
        for i in range(n_clusters):
            center = kmeans.cluster_centers_[i]
            distances = np.linalg.norm(X - center, axis=1)
            cluster_indices = np.where(kmeans.labels_ == i)[0]
            if len(cluster_indices) > 0:
                closest_idx = cluster_indices[np.argmin(distances[cluster_indices])]
                exemplars.append(items[closest_idx])
            
        return exemplars

embedding_service = EmbeddingService()
