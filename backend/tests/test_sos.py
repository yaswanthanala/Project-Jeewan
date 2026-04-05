"""
JEEWAN Backend — Pytest Unit Tests for SOS MS
Tests: health, SOS trigger, emergency contacts
Target: http://localhost:8002
"""
import pytest
import httpx

BASE_URL = "http://localhost:8002"


@pytest.fixture(scope="module")
def client():
    with httpx.Client(base_url=BASE_URL, timeout=10.0) as c:
        yield c


class TestSOSHealth:
    """SOS MS health check."""

    def test_health_endpoint(self, client):
        r = client.get("/health")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert data["service"] == "sos-ms"


class TestSOSTrigger:
    """SOS trigger endpoint — simulates panic button press."""

    def test_trigger_with_gps(self, client):
        r = client.post("/sos/trigger", json={
            "latitude": 17.3850,
            "longitude": 78.4867,
            "user_id": "test-user-1",
        })
        assert r.status_code == 200
        data = r.json()
        assert "sms_sent" in data or "status" in data

    def test_trigger_without_gps(self, client):
        """SOS should either work without GPS or return validation error."""
        r = client.post("/sos/trigger", json={
            "user_id": "test-user-2",
        })
        # Accept success OR validation error (GPS may be required)
        assert r.status_code in [200, 400, 422]

    def test_trigger_response_time(self, client):
        """SOS must respond in under 3 seconds (NFR-07)."""
        import time
        start = time.time()
        r = client.post("/sos/trigger", json={
            "latitude": 17.3850,
            "longitude": 78.4867,
            "user_id": "perf-test",
        })
        elapsed = time.time() - start
        assert r.status_code == 200
        assert elapsed < 3.0, f"SOS response took {elapsed:.2f}s — must be under 3s"


class TestSOSContacts:
    """Emergency contacts endpoint."""

    def test_get_contacts(self, client):
        r = client.get("/sos/contacts")
        if r.status_code == 200:
            data = r.json()
            assert isinstance(data, (list, dict))
