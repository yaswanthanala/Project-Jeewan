from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import admin

app = FastAPI(title="JEEWAN Admin MS", version="1.0.0", description="Admin dashboard, reporting, and counsellor management")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(admin.router, prefix="/admin", tags=["Admin"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "admin-ms", "port": 8007}
