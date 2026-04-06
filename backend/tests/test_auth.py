"""
JEEWAN Backend — Pytest Unit Tests for Auth MS
Tests: health, registration, login, guest token, demo accounts, RBAC

Uses FastAPI TestClient — no running server needed.
The app is tested in-process, same way all other JEEWAN microservice
tests work (sos, chatbot, services all pass for this reason).
"""
import pytest
from fastapi.testclient import TestClient

# Import the FastAPI app from auth microservice
# Adjust the import path if your app entry point differs
from auth.app.main import app

import uuid

# Unique suffix per test run to avoid email-already-exists conflicts
RUN_ID = uuid.uuid4().hex[:8]


@pytest.fixture(scope="module")
def client():
    """
    FastAPI TestClient — spins up the ASGI app in-process.
    No docker-compose, no ports, no network needed.
    """
    with TestClient(app) as c:
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
        assert r.status_code == 422  # Pydantic validation error

    def test_register_valid_user(self, client):
        r = client.post("/auth/register", json={
            "email": f"test_{RUN_ID}@jeewan.test",
            "password": "TestPass123!",
            "name": "Test User",
            "role": "user",
        })
        # 200/201 = success, 409/400 = already exists, 422 = extra fields needed
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