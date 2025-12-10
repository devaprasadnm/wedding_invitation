import pytest
from httpx import AsyncClient
from app.main import app
from unittest.mock import MagicMock, patch

# Mock Supabase Client
@pytest.fixture
def mock_supabase():
    with patch("app.core.supabase.supabase") as mock:
        yield mock

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "Wedding API is running"}

@pytest.mark.asyncio
async def test_get_invite_not_found(mock_supabase):
    # Setup mock to return empty data for client lookup
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/invite/non-existent")
    
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_create_rsvp_client_found(mock_supabase):
    # Setup mock for client lookup
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [{"id": "client-123"}]
    
    # Setup mock for insertion
    mock_supabase.table.return_value.insert.return_value.execute.return_value.data = [{
        "id": "rsvp-1",
        "client_id": "client-123",
        "name": "John Doe",
        "response": "yes",
        "created_at": "2023-01-01T00:00:00Z"
    }]

    payload = {"name": "John Doe", "response": "yes"}
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/api/invite/test-slug/rsvp", json=payload)
    
    assert response.status_code == 200
    assert response.json()["name"] == "John Doe"
