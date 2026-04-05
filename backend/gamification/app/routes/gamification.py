from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime, timezone
from typing import Optional

router = APIRouter()

# In-memory stores (Redis in production)
_pledges: dict = {}   # user_id -> {last_date, streak}
_badges: dict = {}    # user_id -> [badge_names]
_leaderboard: dict = {}  # institution -> points


BADGE_RULES = {
    "First Step": {"type": "streak", "threshold": 1, "emoji": "🌱"},
    "Week Warrior": {"type": "streak", "threshold": 7, "emoji": "🔥"},
    "Month Master": {"type": "streak", "threshold": 30, "emoji": "🏆"},
    "Awareness Champion": {"type": "quiz_perfect", "threshold": 3, "emoji": "🧠"},
    "Drug-Free Ambassador": {"type": "streak", "threshold": 30, "emoji": "🎖️"},
}


class PledgeResponse(BaseModel):
    streak: int
    pledged_today: bool
    new_badges: list[str]
    all_badges: list[str]


@router.post("/pledge/daily")
async def daily_pledge(user_id: str = "demo-user", institution: str = "NIT AP"):
    """Record a daily drug-free pledge. One per 24 hours, builds a streak."""
    today = datetime.now(timezone.utc).date().isoformat()
    user_data = _pledges.get(user_id, {"last_date": None, "streak": 0})

    if user_data["last_date"] == today:
        return {"error": "Already pledged today", "streak": user_data["streak"]}

    # Calculate streak
    streak = user_data["streak"] + 1
    _pledges[user_id] = {"last_date": today, "streak": streak}

    # Award points to institution
    _leaderboard[institution] = _leaderboard.get(institution, 0) + 10

    # Check badges
    new_badges = []
    user_badges = _badges.get(user_id, [])
    for name, rule in BADGE_RULES.items():
        if name not in user_badges and rule["type"] == "streak" and streak >= rule["threshold"]:
            user_badges.append(name)
            new_badges.append(f"{rule['emoji']} {name}")
    _badges[user_id] = user_badges

    return PledgeResponse(
        streak=streak,
        pledged_today=True,
        new_badges=new_badges,
        all_badges=[f"{BADGE_RULES[b]['emoji']} {b}" for b in user_badges],
    )


@router.get("/streak")
async def get_streak(user_id: str = "demo-user"):
    """Get current streak for a user."""
    data = _pledges.get(user_id, {"streak": 0})
    return {"user_id": user_id, "streak": data.get("streak", 0)}


@router.get("/badges")
async def get_badges(user_id: str = "demo-user"):
    """Get all badges earned by a user."""
    user_badges = _badges.get(user_id, [])
    return {
        "user_id": user_id,
        "badges": [{"name": b, "emoji": BADGE_RULES.get(b, {}).get("emoji", "🏅")} for b in user_badges],
        "count": len(user_badges),
    }


@router.get("/leaderboard/institutions")
async def institution_leaderboard():
    """Get institution leaderboard ranked by participation points."""
    # Add demo data if empty
    if not _leaderboard:
        _leaderboard.update({
            "NIT AP": 12450, "JNTU Kakinada": 9820, "IIT Tirupati": 8730,
            "BITS Hyderabad": 7650, "VIT Vellore": 6500, "SRM Chennai": 5200,
        })

    sorted_lb = sorted(_leaderboard.items(), key=lambda x: x[1], reverse=True)
    return {
        "leaderboard": [
            {"rank": i + 1, "institution": name, "points": pts}
            for i, (name, pts) in enumerate(sorted_lb)
        ],
        "total_institutions": len(sorted_lb),
    }


@router.post("/quiz/complete")
async def quiz_complete(user_id: str = "demo-user", score: int = 0, perfect: bool = False, institution: str = "NIT AP"):
    """Record quiz completion — award points and check badge eligibility."""
    _leaderboard[institution] = _leaderboard.get(institution, 0) + (score * 5)
    return {"points_awarded": score * 5, "institution": institution}
