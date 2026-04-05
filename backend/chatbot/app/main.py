from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
import os
import httpx
from collections import defaultdict
from datetime import datetime
from typing import List, Dict

app = FastAPI(title="JEEWAN Chatbot MS", version="2.0.0", description="AI Chatbot with Sarvam AI + Conversation Memory + Crisis NLU")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Socket.io server
sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode="asgi")
socket_app = socketio.ASGIApp(sio, app)

# ── In-memory conversation history (per session) ──
# In production, use Redis. For prototype, dict is fine.
conversation_store: Dict[str, List[Dict[str, str]]] = defaultdict(list)
MAX_HISTORY = 20  # Keep last 20 messages for context window

SYSTEM_PROMPT = """You are JEEWAN (Join Educate Empower War Against Narcotics), an empathetic AI counsellor specialising in drug awareness and addiction support in India.

PERSONALITY:
- Warm, compassionate, and non-judgmental
- Use simple language accessible to college students
- Respond in the same language the user writes (English, Hindi, or Telugu)
- Never shame or lecture — always validate feelings first
- Be concise — 2-4 short paragraphs max

KNOWLEDGE:
- Drug awareness: signs of addiction, types of substances, effects on body/mind
- Recovery support: coping strategies, withdrawal management, relapse prevention
- Indian context: NDPS Act, government rehab schemes, support organisations
- Mental health: stress, peer pressure, anxiety, depression related to substance abuse
- DAST-10 risk assessment quiz guidance

CRISIS PROTOCOL (use IMMEDIATELY if user mentions suicide, self-harm, overdose, or danger):
🆘 EMERGENCY HELPLINES:
- Emergency: 112
- iCall Helpline: 9152987821
- Vandrevala Foundation: 1860-2662-345
- NIMHANS: 080-46110007
Always tell user "You are not alone. Your life matters."

FEATURES YOU CAN SUGGEST:
- "Take our DAST-10 risk assessment quiz at /quiz"
- "Find rehab centres near you at /maps"
- "Take the daily drug-free pledge at /dashboard"
- "Read survivor stories at /stories"
- "Report drug activity anonymously at /tipoff"

RULES:
- Never provide medical prescriptions or dosage advice
- Never encourage or normalize drug use
- Always redirect to professional help for serious cases
- If unsure, say so honestly and suggest professional consultation"""

# ── Crisis keywords for instant detection ──
CRISIS_KEYWORDS = ["suicide", "kill myself", "end my life", "overdose", "dying", "want to die", "self harm", "cut myself", "no point living"]
CRISIS_RESPONSE = """🆘 I hear you, and I want you to know that your life matters deeply. You are NOT alone in this.

**Please reach out right now:**
📞 **Emergency: 112**
📞 **iCall Helpline: 9152987821**
📞 **Vandrevala Foundation: 1860-2662-345**

I'm here with you. Would you like to talk about what you're going through? There are people who care about you and want to help. 💙"""

# ── Intent keywords for scripted responses ──
SCRIPTED_INTENTS = {
    "withdrawal": {
        "keywords": ["withdrawal", "cold turkey", "shaking", "sweating", "nausea", "can't stop"],
        "response": "Withdrawal can be really challenging, and it's brave of you to acknowledge it. Common symptoms include anxiety, sweating, nausea, and restlessness.\n\n**Please don't go through this alone:**\n- Consult a doctor before stopping suddenly — some withdrawals need medical supervision\n- Stay hydrated and try to eat light meals\n- Would you like me to find a rehab centre near you? Visit /maps\n\nYou're taking the right step by reaching out. 💪"
    },
    "addiction_signs": {
        "keywords": ["signs", "addicted", "hooked", "dependent", "am i addicted", "problem with drugs"],
        "response": "It takes courage to ask that question. Here are some warning signs to look for:\n\n• Needing more of a substance to get the same effect\n• Feeling anxious or sick when you stop\n• Using even when it causes problems at work/school/home\n• Spending more time and money on substances\n• Losing interest in things you used to enjoy\n\n**Want to check your risk level?** Take our confidential DAST-10 quiz at /quiz — it takes only 2 minutes."
    },
    "legal": {
        "keywords": ["law", "legal", "arrest", "ndps", "police", "jail", "caught"],
        "response": "Under India's **NDPS Act (1985)**:\n\n✅ Seeking treatment is **encouraged and protected**\n✅ Voluntary disclosure for treatment purposes is confidential\n✅ Government rehab centres provide free treatment\n⚠️ Possession of small quantities may lead to counselling rather than prosecution\n\nThe law is designed to help people recover, not punish them. Would you like help finding a government rehab centre?"
    },
    "peer_pressure": {
        "keywords": ["friends", "peer", "pressure", "say no", "party", "everyone doing it", "fit in"],
        "response": "Peer pressure is one of the biggest challenges, especially in college. Here are some strategies that actually work:\n\n🛡️ **Quick responses:**\n- \"No thanks, I'm good\" — simple and firm\n- \"I have to drive/study/work tomorrow\"\n- Change the subject to something else\n\n💪 **Long-term strategies:**\n- Find friends who support your choices\n- Join clubs or activities that don't involve substances\n- Remember: real friends respect your boundaries\n\nYou don't need substances to have fun or fit in. 🌟"
    },
    "recovery": {
        "keywords": ["recovery", "clean", "sober", "quit", "stop using", "better now", "day streak"],
        "response": "That's amazing! Every single day of recovery is a victory worth celebrating! 🎉\n\n**Keep your momentum going:**\n- Take the daily drug-free pledge at /dashboard\n- Connect with others on the leaderboard at /leaderboard\n- Read survivor stories for inspiration at /stories\n\nYour journey inspires others. Be proud of how far you've come! 💙"
    },
}


async def get_ai_response(user_input: str, session_id: str = "anonymous") -> str:
    """Get response using conversation history + Sarvam AI with fallback."""

    # 1. Crisis check — immediate response
    lower_input = user_input.lower()
    for kw in CRISIS_KEYWORDS:
        if kw in lower_input:
            return CRISIS_RESPONSE

    # 2. Check scripted intents
    for intent_name, intent_data in SCRIPTED_INTENTS.items():
        if any(kw in lower_input for kw in intent_data["keywords"]):
            return intent_data["response"]

    # 3. Build conversation history for LLM
    history = conversation_store.get(session_id, [])

    # Add current user message to history
    conversation_store[session_id].append({"role": "user", "content": user_input})

    # Trim to MAX_HISTORY
    if len(conversation_store[session_id]) > MAX_HISTORY:
        conversation_store[session_id] = conversation_store[session_id][-MAX_HISTORY:]

    # 4. Try Sarvam AI API
    api_key = os.getenv("SARVAM_API_KEY", "")
    if api_key and api_key != "your-sarvam-api-key-here":
        try:
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            messages.extend(conversation_store[session_id][-10:])  # Last 10 messages for context

            async with httpx.AsyncClient(timeout=20.0) as client:
                r = await client.post(
                    "https://api.sarvam.ai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                    json={
                        "model": "sarvam-m",
                        "messages": messages,
                        "max_tokens": 500,
                        "temperature": 0.7,
                    }
                )
                if r.status_code == 200:
                    ai_reply = r.json()["choices"][0]["message"]["content"]
                    # Strip Sarvam's internal <think>...</think> reasoning tags
                    import re
                    ai_reply = re.sub(r'<think>.*?</think>', '', ai_reply, flags=re.DOTALL).strip()
                    if not ai_reply:
                        ai_reply = "I'm here for you. How can I help today?"
                    # Save AI response to history
                    conversation_store[session_id].append({"role": "assistant", "content": ai_reply})
                    return ai_reply
        except Exception as e:
            print(f"[Chatbot] Sarvam API error: {e}")

    # 5. Intelligent fallback
    fallback_responses = [
        "I understand you're reaching out, and that takes real courage. Could you tell me a bit more about what's on your mind? I'm here to listen without judgment.",
        "Thank you for sharing that. I want to make sure I give you the best support. Can you help me understand a bit more about your situation?",
        "I hear you. Whatever you're going through, you don't have to face it alone. Would you like to talk more about this, or would you prefer I suggest some resources?",
        "That's a really important question. While I'm connecting to my full AI capabilities, let me share what I can: every step toward awareness is a step toward a healthier life.",
    ]
    import hashlib
    idx = int(hashlib.md5(user_input.encode()).hexdigest(), 16) % len(fallback_responses)
    reply = fallback_responses[idx]
    conversation_store[session_id].append({"role": "assistant", "content": reply})
    return reply


# ── Socket.io handlers ──
@sio.on("connect")
async def handle_connect(sid, environ):
    greeting = "Hello! I'm **JEEWAN**, your AI companion for drug awareness and support. 💙\n\nYou can talk to me about anything — peer pressure, addiction concerns, recovery, or just how you're feeling. I'm here to listen, not judge.\n\nHow can I help you today?"
    await sio.emit("response", {"text": greeting, "type": "greeting"}, room=sid)


@sio.on("message")
async def handle_message(sid, data):
    user_msg = data.get("text", "") if isinstance(data, dict) else str(data)
    session_id = data.get("session_id", sid) if isinstance(data, dict) else sid
    response = await get_ai_response(user_msg, session_id)
    await sio.emit("response", {"text": response, "session_id": session_id}, room=sid)


@sio.on("disconnect")
async def handle_disconnect(sid):
    pass


# REST endpoints
from app.routes import chat
app.include_router(chat.router, prefix="/chat", tags=["Chatbot"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "chatbot-ms", "port": 8003, "version": "2.0.0"}
