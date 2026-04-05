from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class ChatRequest(BaseModel):
    text: str
    session_id: str = "anonymous"


class ChatResponse(BaseModel):
    response: str
    session_id: str
    is_crisis: bool = False


@router.post("/send", response_model=ChatResponse)
async def send_message(payload: ChatRequest):
    """Send a message to the JEEWAN AI chatbot with conversation memory."""
    from app.main import get_ai_response, CRISIS_KEYWORDS

    # Check for crisis
    is_crisis = any(kw in payload.text.lower() for kw in CRISIS_KEYWORDS)

    response = await get_ai_response(payload.text, payload.session_id)
    return ChatResponse(response=response, session_id=payload.session_id, is_crisis=is_crisis)


@router.get("/history")
async def get_history(session_id: str = "anonymous"):
    """Get conversation history for a session."""
    from app.main import conversation_store
    messages = conversation_store.get(session_id, [])
    return {"session_id": session_id, "messages": messages, "count": len(messages)}


@router.post("/clear")
async def clear_history(session_id: str = "anonymous"):
    """Clear conversation history for a session."""
    from app.main import conversation_store
    conversation_store.pop(session_id, None)
    return {"session_id": session_id, "cleared": True}
