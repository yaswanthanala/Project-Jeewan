from locust import HttpUser, task, between

class JeewanLoadUser(HttpUser):
    """
    Locust load test for the JEEWAN backend services.
    Command to run: locust -f locustfile.py --host=http://localhost
    """
    wait_time = between(1, 3)

    @task(3)
    def test_sos_latency(self):
        # Simulate high-load concurrent SOS triggers
        # This will be picked up by the Prometheus Instrumentator
        self.client.post("/api/sos/trigger", json={
            "phone": "9152987821",
            "lat": 19.0760,
            "lng": 72.8777
        })

    @task(1)
    def test_auth_health(self):
        self.client.get("/api/auth/health")

    @task(2)
    def test_risk_assessment(self):
        self.client.post("/api/risk/assess", json={
            "score": 4,
            "answers": [1, 0, 1, 0, 0, 1, 0, 1, 0, 0]
        })
