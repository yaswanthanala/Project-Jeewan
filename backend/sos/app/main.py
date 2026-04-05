from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import sos
from app.database import engine, Base

app = FastAPI(title="JEEWAN SOS MS", version="1.0.0", description="SOS / Crisis microservice")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


app.include_router(sos.router, prefix="/sos", tags=["SOS"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "sos-ms", "port": 8002}
