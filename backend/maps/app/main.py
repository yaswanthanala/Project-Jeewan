from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import maps

app = FastAPI(title="JEEWAN Maps MS", version="1.0.0", description="Rehab centre locator using OpenStreetMap")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(maps.router, prefix="/maps", tags=["Maps"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "maps-ms", "port": 8005}
