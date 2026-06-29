import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

@pytest.mark.asyncio
async def test_missing_business_dashboard(client: AsyncClient):
    response = await client.get("/api/dashboard/non-existent-business")
    assert response.status_code == 404
