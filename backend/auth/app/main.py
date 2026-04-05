from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth
from app.database import engine, Base

app = FastAPI(
    title="JEEWAN Auth MS",
    version="1.0.0",
    description="Authentication & RBAC microservice for JEEWAN platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:80", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    # Initialize demo user accounts with hashed passwords
    from app.routes.auth import _init_demo_users
    _init_demo_users()


app.include_router(auth.router, prefix="/auth", tags=["Authentication"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "auth-ms", "port": 8001}


@app.get("/metrics")
async def metrics():
    from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
    from fastapi.responses import Response
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
