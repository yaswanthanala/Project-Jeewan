from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import risk

app = FastAPI(title="JEEWAN Risk Assessment MS", version="1.0.0", description="DAST-10 quiz scoring and risk flagging")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(risk.router, prefix="/risk", tags=["Risk Assessment"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "risk-ms", "port": 8006}
