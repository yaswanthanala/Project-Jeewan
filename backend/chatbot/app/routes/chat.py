from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ChatRequest(BaseModel):
    text: str
    session_id: str = "anonymous"


@router.post("/send")
async def send_message(payload: ChatRequest):
    """REST fallback for chatbot — prefer WebSocket /socket.io/ for real-time."""
    from app.main import get_ai_response
    response = await get_ai_response(payload.text)
    return {"response": response, "session_id": payload.session_id}


@router.get("/history")
async def get_history(session_id: str = "anonymous"):
    """Placeholder — returns empty history (sessions stored in Redis in production)."""
    return {"session_id": session_id, "messages": []}
