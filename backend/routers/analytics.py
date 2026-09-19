from fastapi import APIRouter

router = APIRouter(prefix="/api/analytics", tags=["Municipal Analytics & Pulse"])

@router.get("/ward-summary")
async def get_ward_summary():
    """
    Get high-level municipal ward performance metrics for AMC dashboard.
    """
    return {
        "city": "Ahmedabad",
        "totalWards": 48,
        "activeIssues": 142,
        "resolvedThisMonth": 1280,
        "avgResolutionSlaHours": 6.4,
        "topPerformingWard": "Navrangpura Ward #14",
        "civicEngagementScore": 94.8,
        "wardsLeaderboard": [
            {"ward": "Navrangpura Ward #14", "score": 98.2, "resolved": 320, "pending": 12},
            {"ward": "Bodakdev Ward #21", "score": 95.4, "resolved": 285, "pending": 18},
            {"ward": "Sabarmati Ward #03", "score": 92.1, "resolved": 240, "pending": 25},
            {"ward": "Maninagar Ward #08", "score": 89.6, "resolved": 210, "pending": 31},
            {"ward": "Paldi Ward #12", "score": 87.5, "resolved": 195, "pending": 38}
        ]
    }

@router.get("/spotlight")
async def get_civic_spotlight():
    """
    Get community grassroots civic spotlight projects.
    """
    return {
        "spotlight": [
            {
                "id": "SPOT-01",
                "title": "Sabarmati Riverfront Green Tree Plantation Drive",
                "organizer": "Navrangpura Youth Council",
                "volunteersCount": 145,
                "date": "2026-09-25",
                "location": "Sabarmati Riverfront Park, Ahmedabad",
                "imageUrl": "/src/assets/images/sabarmati_riverfront_drive_1789740233986.jpg"
            },
            {
                "id": "SPOT-02",
                "title": "Clean CG Road Zero-Waste Drive",
                "organizer": "AMC Ward 14 Sanitation Brigade",
                "volunteersCount": 210,
                "date": "2026-09-28",
                "location": "CG Road Commercial Belt, Ahmedabad",
                "imageUrl": "/src/assets/images/ahmedabad_hero_real_1789766454218.jpg"
            }
        ]
    }
