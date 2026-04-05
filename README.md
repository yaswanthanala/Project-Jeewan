# JEEWAN — Join Educate Empower War Against Narcotics

> Anti-Drug Awareness Platform built with Microservices Architecture

[![Build](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Tests](https://img.shields.io/badge/tests-31%20passed-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Nginx Ingress                     │
│              (API Gateway - Port 80)                 │
└──┬────┬────┬────┬────┬────┬────┬────────────────────┘
   │    │    │    │    │    │    │
   ▼    ▼    ▼    ▼    ▼    ▼    ▼
┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐
│Auth││SOS ││Chat││Game││Maps││Risk││Admin│
│8001││8002││8003││8004││8005││8006││8007 │
└──┬─┘└────┘└──┬─┘└──┬─┘└────┘└──┬─┘└──┬─┘
   │           │     │           │     │
   ▼           ▼     ▼           ▼     ▼
┌──────┐ ┌─────────┐ ┌─────┐ ┌──────────┐
│ PSQL │ │Sarvam AI│ │Redis│ │MongoDB   │
│      │ │  (LLM)  │ │     │ │ (Tipoffs)│
└──────┘ └─────────┘ └─────┘ └──────────┘
```

### Microservices

| Service | Port | Description |
|---|---|---|
| **Auth MS** | 8001 | Firebase Auth, JWT, RBAC (5 roles) |
| **SOS MS** | 8002 | Emergency panic button, GPS + SMS |
| **Chatbot MS** | 8003 | Sarvam AI counsellor, conversation memory |
| **Gamification MS** | 8004 | Daily pledges, streaks, badges, leaderboard |
| **Maps MS** | 8005 | Rehab centre locator (OpenStreetMap) |
| **Risk MS** | 8006 | DAST-10 quiz, risk scoring, auto-flagging |
| **Admin MS** | 8007 | Case management, NMBA analytics |

### Frontend

- **Next.js 15** with Tailwind CSS + shadcn/ui
- **Firebase Auth** with Google Sign-In
- **PWA** with offline support

## Quick Start

### Prerequisites
- Docker Desktop
- Node.js 20+ / Yarn
- Python 3.12+

### 1. Clone & Setup
```bash
git clone https://github.com/your-org/Project-Jeewan.git
cd Project-Jeewan
```

### 2. Start Backend (Docker)
```bash
cd backend
cp .env.example .env   # Edit with your credentials
docker-compose up -d
```

### 3. Start Frontend
```bash
cd frontend
yarn install
yarn dev
```
Open http://localhost:3000

### 4. Run Tests
```bash
# Backend unit tests
cd backend
pip install -r requirements-test.txt
python -m pytest tests/ -v --tb=short

# Selenium E2E (needs Chrome + frontend running)
python -m pytest tests/e2e/ -v
```

## CI/CD Pipeline

```
GitHub Push → Jenkins → SonarQube → Pytest → Selenium → Docker Push → K8s Deploy
```

- **Jenkinsfile** — 7-stage declarative pipeline
- **SonarQube** — Code quality gate (A rating target)
- **Docker Hub** — Image registry (free tier)
- **Kubernetes** — Minikube with Nginx Ingress

### Deploy to Kubernetes
```bash
minikube start --driver=docker
minikube addons enable ingress
kubectl apply -f k8s/ --recursive
kubectl get pods -n jeewan
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, Tailwind CSS, shadcn/ui |
| Backend | Python 3.12, FastAPI |
| AI/LLM | Sarvam AI (105B model) |
| Auth | Firebase Auth + JWT |
| DB | PostgreSQL, MongoDB Atlas, Redis |
| Maps | OpenStreetMap + Leaflet.js |
| CI/CD | Jenkins, SonarQube, Docker, K8s |
| Testing | Pytest, Selenium 4, Jest |
| Monitoring | Prometheus + Grafana |

## Project Structure

```
Project-Jeewan/
├── frontend/              # Next.js 15 app
│   ├── app/               # Pages (App Router)
│   ├── components/        # Reusable components
│   └── lib/               # API client, Firebase, AuthContext
├── backend/               # FastAPI microservices
│   ├── auth/              # Auth MS (:8001)
│   ├── sos/               # SOS MS (:8002)
│   ├── chatbot/           # Chatbot MS (:8003)
│   ├── gamification/      # Gamification MS (:8004)
│   ├── maps/              # Maps MS (:8005)
│   ├── risk/              # Risk MS (:8006)
│   ├── admin/             # Admin MS (:8007)
│   ├── docker-compose.yml # Orchestration
│   └── tests/             # Pytest + Selenium
├── k8s/                   # Kubernetes manifests
├── Jenkinsfile            # CI/CD pipeline
└── sonar-project.properties
```

## Team

| Role | Focus |
|---|---|
| Frontend Dev | Next.js, Firebase Auth, UI/UX |
| Backend Dev | FastAPI, Sarvam AI, Database |
| DevOps | Docker, K8s, Jenkins, Monitoring |

## License

MIT — For educational purposes (SE Project)
