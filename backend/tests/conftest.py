import pytest
from typing import AsyncGenerator
from httpx import AsyncClient
from app.main import app

@pytest.fixture
def anyio_backend():
    return 'asyncio'

@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
