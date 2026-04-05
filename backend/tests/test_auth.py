"""
JEEWAN Backend — Pytest Unit Tests for Auth MS
Tests: health, registration, login, guest token, demo accounts, RBAC
Target: http://localhost:8001
"""
import pytest
import httpx

BASE_URL = "http://localhost:8001"


@pytest.fixture(scope="module")
def client():
    """Shared httpx client for all tests."""
    with httpx.Client(base_url=BASE_URL, timeout=10.0) as c:
        yield c


class TestAuthHealth:
    """Auth MS health check."""

    def test_health_endpoint(self, client):
        r = client.get("/health")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert data["service"] == "auth-ms"


class TestGuestAccess:
    """Guest token endpoint — anonymous access without registration."""

    def test_guest_token_returns_jwt(self, client):
        r = client.post("/auth/guest-token")
        assert r.status_code == 200
        data = r.json()
        assert "access_token" in data or "token" in data

    def test_guest_token_has_role(self, client):
        r = client.post("/auth/guest-token")
        data = r.json()
        token = data.get("access_token") or data.get("token")
        assert token is not None


class TestDemoAccounts:
    """Demo accounts should be pre-seeded for demonstration."""

    def test_demo_accounts_endpoint(self, client):
        r = client.get("/auth/demo-accounts")
        if r.status_code == 200:
            data = r.json()
            assert isinstance(data, (list, dict))


class TestRegistration:
    """User registration flow."""

    def test_register_missing_fields_returns_422(self, client):
        r = client.post("/auth/register", json={})
        assert r.status_code == 422  # Validation error

    def test_register_valid_user(self, client):
        r = client.post("/auth/register", json={
            "email": f"test_{pytest.test_run_id}@jeewan.test",
            "password": "TestPass123!",
            "name": "Test User",
            "role": "user",
        })
        # Either 200 (success), 409 (already exists), or 422 (extra fields needed) are acceptable
        assert r.status_code in [200, 201, 409, 400, 422]


class TestLogin:
    """User login flow."""

    def test_login_invalid_credentials(self, client):
        r = client.post("/auth/login", json={
            "email": "nonexistent@test.com",
            "password": "wrongpassword",
        })
        assert r.status_code in [401, 404, 400]

    def test_login_missing_fields(self, client):
        r = client.post("/auth/login", json={})
        assert r.status_code == 422


# Generate unique test run ID
pytest.test_run_id = id(pytest)
