from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

# Demo data for admin dashboard
_demo_cases = [
    {"case_id": 2847, "source": "DAST-10 Quiz", "score": 9, "risk_level": "severe", "institution": "NIT AP", "timestamp": "2025-04-05T08:30:00Z", "status": "pending", "assigned_to": None},
    {"case_id": 2843, "source": "SOS Trigger", "score": None, "risk_level": "critical", "institution": "JNTU Kakinada", "timestamp": "2025-04-05T05:15:00Z", "status": "pending", "assigned_to": None},
    {"case_id": 2840, "source": "DAST-10 Quiz", "score": 7, "risk_level": "high", "institution": "IIT Tirupati", "timestamp": "2025-04-04T14:00:00Z", "status": "assigned", "assigned_to": "Dr. Priya Sharma"},
    {"case_id": 2831, "source": "DAST-10 Quiz", "score": 8, "risk_level": "high", "institution": "VIT Vellore", "timestamp": "2025-04-03T09:20:00Z", "status": "resolved", "assigned_to": "Dr. Ravi Kumar"},
]

_demo_counsellors = [
    {"id": 1, "name": "Dr. Priya Sharma", "specialization": "Clinical Psychology", "rating": 4.9, "active_cases": 3, "available": True},
    {"id": 2, "name": "Dr. Ravi Kumar", "specialization": "Addiction Medicine", "rating": 4.7, "active_cases": 5, "available": True},
    {"id": 3, "name": "Dr. Anita Desai", "specialization": "Behavioural Therapy", "rating": 4.8, "active_cases": 2, "available": False},
]

_demo_stats = {
    "total_users": 12450,
    "active_today": 342,
    "high_risk_flagged": 47,
    "sos_triggers_today": 3,
    "quizzes_completed": 8920,
    "avg_risk_score": 3.2,
    "counsellor_sessions_today": 18,
    "institutions_enrolled": 156,
}


@router.get("/cases")
async def get_flagged_cases(status: Optional[str] = None):
    """Get all flagged risk cases for admin review."""
    cases = _demo_cases
    if status:
        cases = [c for c in cases if c["status"] == status]
    return {"cases": cases, "total": len(cases)}


@router.post("/cases/{case_id}/assign")
async def assign_case(case_id: int, counsellor_id: int):
    """Assign a flagged case to a counsellor."""
    for case in _demo_cases:
        if case["case_id"] == case_id:
            counsellor = next((c for c in _demo_counsellors if c["id"] == counsellor_id), None)
            if counsellor:
                case["status"] = "assigned"
                case["assigned_to"] = counsellor["name"]
                return {"status": "assigned", "case_id": case_id, "counsellor": counsellor["name"]}
    return {"error": "Case or counsellor not found"}


@router.post("/cases/{case_id}/resolve")
async def resolve_case(case_id: int):
    """Mark a case as resolved."""
    for case in _demo_cases:
        if case["case_id"] == case_id:
            case["status"] = "resolved"
            return {"status": "resolved", "case_id": case_id}
    return {"error": "Case not found"}


@router.get("/stats")
async def get_dashboard_stats():
    """Get aggregate platform statistics for admin dashboard."""
    return _demo_stats


@router.get("/counsellors")
async def get_counsellors():
    """List all registered counsellors."""
    return {"counsellors": _demo_counsellors, "total": len(_demo_counsellors)}


@router.get("/nmba")
async def get_nmba_analytics():
    """NMBA (Narcotics Monitoring & Behavioral Analytics) data."""
    return {
        "hotspot_districts": [
            {"district": "East Godavari", "state": "AP", "risk_index": 8.2, "cases_this_month": 23},
            {"district": "Krishna", "state": "AP", "risk_index": 7.1, "cases_this_month": 15},
            {"district": "Hyderabad", "state": "Telangana", "risk_index": 6.8, "cases_this_month": 31},
        ],
        "trend": {"direction": "declining", "change_pct": -12.3, "period": "last_30_days"},
        "top_substances": [
            {"name": "Cannabis", "percentage": 42},
            {"name": "Opioids", "percentage": 28},
            {"name": "Alcohol", "percentage": 18},
            {"name": "Synthetic Drugs", "percentage": 12},
        ],
    }


@router.get("/tipoffs")
async def get_tipoffs():
    """Get anonymous tip-off reports (from MongoDB in production)."""
    return {
        "tipoffs": [
            {"id": "tip-001", "description": "Suspicious activity near college gate", "location": "NIT AP Campus", "timestamp": "2025-04-05T07:00:00Z", "status": "under_review"},
            {"id": "tip-002", "description": "Drug supply at hostel area", "location": "JNTU Kakinada", "timestamp": "2025-04-04T22:30:00Z", "status": "forwarded_to_police"},
        ],
        "total": 2,
    }
