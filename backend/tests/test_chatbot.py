"""
JEEWAN Backend — Pytest Unit Tests for Chatbot MS
Tests: health, chat send, conversation memory, crisis detection, session history
Target: http://localhost:8003
"""
import pytest
import httpx

BASE_URL = "http://localhost:8003"


@pytest.fixture(scope="module")
def client():
    with httpx.Client(base_url=BASE_URL, timeout=25.0) as c:
        yield c


class TestChatbotHealth:
    """Chatbot MS health check."""

    def test_health_endpoint(self, client):
        r = client.get("/health")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert data["service"] == "chatbot-ms"


class TestChatSend:
    """Chat send endpoint — AI response."""

    def test_send_greeting(self, client):
        r = client.post("/chat/send", json={"text": "hello", "session_id": "pytest-1"})
        assert r.status_code == 200
        data = r.json()
        assert "response" in data
        assert len(data["response"]) > 10  # Not empty

    def test_send_addiction_question(self, client):
        r = client.post("/chat/send", json={"text": "What are signs of addiction?", "session_id": "pytest-2"})
        assert r.status_code == 200
        data = r.json()
        assert "response" in data
        assert data["is_crisis"] is False

    def test_no_think_tags_in_response(self, client):
        """Sarvam AI <think> tags must be stripped."""
        r = client.post("/chat/send", json={"text": "Tell me about drug abuse effects", "session_id": "pytest-3"})
        assert r.status_code == 200
        data = r.json()
        assert "<think>" not in data["response"]
        assert "</think>" not in data["response"]


class TestCrisisDetection:
    """Crisis messages should return is_crisis=True."""

    def test_suicide_mention_flagged(self, client):
        r = client.post("/chat/send", json={"text": "I want to kill myself", "session_id": "pytest-crisis"})
        assert r.status_code == 200
        data = r.json()
        assert data["is_crisis"] is True
        assert "9152987821" in data["response"]  # Helpline number present

    def test_overdose_mention_flagged(self, client):
        r = client.post("/chat/send", json={"text": "I think I overdosed", "session_id": "pytest-crisis-2"})
        assert r.status_code == 200
        data = r.json()
        assert data["is_crisis"] is True


class TestConversationMemory:
    """Session-based conversation history."""

    def test_history_persists(self, client):
        session = "pytest-memory"
        # Send two messages
        client.post("/chat/send", json={"text": "My name is Arjun", "session_id": session})
        client.post("/chat/send", json={"text": "I need help with peer pressure", "session_id": session})
        # Check history
        r = client.get(f"/chat/history?session_id={session}")
        assert r.status_code == 200
        data = r.json()
        assert data["count"] >= 2

    def test_clear_history(self, client):
        session = "pytest-clear"
        client.post("/chat/send", json={"text": "Hello", "session_id": session})
        r = client.post(f"/chat/clear?session_id={session}")
        assert r.status_code == 200
        # Verify cleared
        r2 = client.get(f"/chat/history?session_id={session}")
        assert r2.json()["count"] == 0
