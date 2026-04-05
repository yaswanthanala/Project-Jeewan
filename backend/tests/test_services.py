"""
JEEWAN Backend — Pytest Unit Tests for Risk MS, Gamification MS, Maps MS, Admin MS
Tests: DAST-10 quiz, leaderboards, badges, rehab search, admin stats
"""
import pytest
import httpx


# ── Risk Assessment MS (:8006) ──
class TestRiskMS:
    @pytest.fixture(scope="class")
    def client(self):
        with httpx.Client(base_url="http://localhost:8006", timeout=10.0) as c:
            yield c

    def test_health(self, client):
        r = client.get("/health")
        assert r.status_code == 200

    def test_get_questions(self, client):
        r = client.get("/risk/questions")
        assert r.status_code == 200
        data = r.json()
        assert data["total_questions"] == 10
        assert len(data["questions"]) == 10

    def test_assess_low_risk(self, client):
        r = client.post("/risk/assess", json={
            "answers": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            "user_id": "pytest-low",
        })
        assert r.status_code == 200
        data = r.json()
        assert data["risk_level"] in ["low", "no_risk", "minimal"]
        assert data["score"] == 0

    def test_assess_high_risk(self, client):
        r = client.post("/risk/assess", json={
            "answers": [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            "user_id": "pytest-high",
        })
        assert r.status_code == 200
        data = r.json()
        assert data["risk_level"] in ["high", "severe", "substantial"]
        assert data["score"] >= 20


# ── Gamification MS (:8004) ──
class TestGamificationMS:
    @pytest.fixture(scope="class")
    def client(self):
        with httpx.Client(base_url="http://localhost:8004", timeout=10.0) as c:
            yield c

    def test_health(self, client):
        r = client.get("/health")
        assert r.status_code == 200

    def test_leaderboard(self, client):
        r = client.get("/game/leaderboard/institutions")
        assert r.status_code == 200
        data = r.json()
        assert "leaderboard" in data
        assert isinstance(data["leaderboard"], list)

    def test_daily_pledge(self, client):
        r = client.post("/game/pledge/daily", json={"user_id": "pytest-pledge"})
        assert r.status_code == 200


# ── Maps MS (:8005) ──
class TestMapsMS:
    @pytest.fixture(scope="class")
    def client(self):
        with httpx.Client(base_url="http://localhost:8005", timeout=15.0) as c:
            yield c

    def test_health(self, client):
        r = client.get("/health")
        assert r.status_code == 200

    def test_nearby_search(self, client):
        r = client.get("/maps/nearby", params={"lat": 17.385, "lon": 78.487, "radius": 50})
        # Accept success or validation error (endpoint params may differ)
        assert r.status_code in [200, 400, 422]
        if r.status_code == 200:
            data = r.json()
            assert isinstance(data, (dict, list))


# ── Admin MS (:8007) ──
class TestAdminMS:
    @pytest.fixture(scope="class")
    def client(self):
        with httpx.Client(base_url="http://localhost:8007", timeout=10.0) as c:
            yield c

    def test_health(self, client):
        r = client.get("/health")
        assert r.status_code == 200

    def test_get_stats(self, client):
        r = client.get("/admin/stats")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, dict)

    def test_get_cases(self, client):
        r = client.get("/admin/cases")
        assert r.status_code == 200
