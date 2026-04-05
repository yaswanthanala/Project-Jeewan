from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio

app = FastAPI(title="JEEWAN Chatbot MS", version="1.0.0", description="AI Chatbot with Sarvam API + Rasa NLU")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Socket.io server
sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode="asgi")
socket_app = socketio.ASGIApp(sio, app)


SCRIPTED_RESPONSES = {
    "crisis_support": "You're not alone. If you're in immediate danger, please call the helpline: 9152987821 (iCall). We're here for you 24/7.",
    "withdrawal_symptoms": "Withdrawal can be tough. Common symptoms include anxiety, sweating, and nausea. Please consult a medical professional. Would you like me to find a rehab centre near you?",
    "addiction_signs": "Key warning signs include: increased tolerance, inability to stop, neglecting responsibilities, and withdrawal symptoms. Early help makes a big difference.",
    "legal_rights": "Under NDPS Act, seeking treatment is encouraged. Voluntary disclosure for treatment is protected. You have the right to confidential counselling.",
    "greeting": "Hello! I'm JEEWAN's AI assistant. I'm here to help with drug awareness, support, and connecting you to resources. How can I help you today?",
}


async def get_ai_response(user_input: str) -> str:
    """Get response from Sarvam AI API or fallback to scripted responses."""
    import os
    import httpx

    # Check for scripted intents first (simple keyword matching as Rasa placeholder)
    lower = user_input.lower()
    if any(w in lower for w in ["help", "sos", "emergency", "crisis", "die", "kill"]):
        return SCRIPTED_RESPONSES["crisis_support"]
    if any(w in lower for w in ["withdraw", "cold turkey", "shaking"]):
        return SCRIPTED_RESPONSES["withdrawal_symptoms"]
    if any(w in lower for w in ["sign", "addict", "hooked", "dependent"]):
        return SCRIPTED_RESPONSES["addiction_signs"]
    if any(w in lower for w in ["law", "legal", "arrest", "ndps", "police"]):
        return SCRIPTED_RESPONSES["legal_rights"]
    if any(w in lower for w in ["hi", "hello", "hey", "start"]):
        return SCRIPTED_RESPONSES["greeting"]

    # Sarvam AI API call
    api_key = os.getenv("SARVAM_API_KEY", "")
    if api_key and api_key != "your-sarvam-api-key-here":
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                r = await client.post(
                    "https://api.sarvam.ai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                    json={
                        "model": "sarvam-m",
                        "messages": [
                            {"role": "system", "content": "You are JEEWAN, an empathetic AI counsellor for drug awareness and addiction support in India. Be warm, non-judgmental, and always prioritize safety. If someone is in crisis, direct them to helpline 9152987821."},
                            {"role": "user", "content": user_input}
                        ],
                        "max_tokens": 300,
                    }
                )
                if r.status_code == 200:
                    return r.json()["choices"][0]["message"]["content"]
        except Exception:
            pass

    # Fallback
    return "I understand you're reaching out, and that takes courage. I'm here to listen. Could you tell me more about what you're going through? If you need immediate help, call 9152987821."


@sio.on("connect")
async def handle_connect(sid, environ):
    await sio.emit("response", {"text": SCRIPTED_RESPONSES["greeting"]}, room=sid)


@sio.on("message")
async def handle_message(sid, data):
    user_msg = data.get("text", "") if isinstance(data, dict) else str(data)
    response = await get_ai_response(user_msg)
    await sio.emit("response", {"text": response}, room=sid)


@sio.on("disconnect")
async def handle_disconnect(sid):
    pass


# REST fallback endpoint
from app.routes import chat
app.include_router(chat.router, prefix="/chat", tags=["Chatbot"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "chatbot-ms", "port": 8003}
