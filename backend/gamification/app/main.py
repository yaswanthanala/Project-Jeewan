from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import gamification

app = FastAPI(title="JEEWAN Gamification MS", version="1.0.0", description="Pledges, streaks, badges, leaderboards")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(gamification.router, prefix="/game", tags=["Gamification"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "gamification-ms", "port": 8004}
