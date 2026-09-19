import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field
from typing import Optional, List

router = APIRouter(prefix="/api/tickets", tags=["Civic Tickets & Issue Tracking"])

# In-memory ticket database with realistic pre-populated Ahmedabad civic issues
TICKETS_DB = [
    {
        "id": "TICK-101",
        "title": "Severe Road Pothole & Caved Asphalt",
        "category": "Roads & Potholes",
        "priority": "High",
        "priorityReason": "Deep pothole causing vehicle axle damage and night accident risk on main artery.",
        "status": "In Progress",
        "ward": "Navrangpura Ward #14",
        "landmark": "Near CG Road Cross Roads",
        "reporterName": "Rahul Sharma",
        "civicScore": 35,
        "hazardFlag": True,
        "upvotes": 42,
        "createdAt": "2026-09-18T14:30:00Z",
        "estimatedSlaHours": 4,
        "assignedSquad": "Navrangpura Road Maintenance Division",
        "imageUrl": "/src/assets/images/pothole_repaired_after_1789742513449.jpg"
    },
    {
        "id": "TICK-102",
        "title": "Hazardous Low-Hanging Electrical Cable",
        "category": "Safety & Hazards",
        "priority": "High",
        "priorityReason": "Exposed high-voltage wire hanging near pedestrian walkway outside school.",
        "status": "Open",
        "ward": "Sabarmati Ward #03",
        "landmark": "Near Riverfront Gate 4",
        "reporterName": "Priya Patel",
        "civicScore": 40,
        "hazardFlag": True,
        "upvotes": 68,
        "createdAt": "2026-09-19T08:15:00Z",
        "estimatedSlaHours": 2,
        "assignedSquad": "Torrent Power & AMC Electrical Grid Safety",
        "imageUrl": "/src/assets/images/evidence_wire_hazard_1789743199289.jpg"
    },
    {
        "id": "TICK-103",
        "title": "Commercial Waste Spillage Overflow",
        "category": "Garbage & Waste",
        "priority": "Medium",
        "priorityReason": "Municipal bin overflowing onto market road causing odor and pest risk.",
        "status": "Resolved",
        "ward": "Bodakdev Ward #21",
        "landmark": "Behind Sindhu Bhavan Road",
        "reporterName": "Amit Shah",
        "civicScore": 30,
        "hazardFlag": False,
        "upvotes": 19,
        "createdAt": "2026-09-17T11:00:00Z",
        "estimatedSlaHours": 12,
        "assignedSquad": "Solid Waste Management Squad B",
        "imageUrl": "/src/assets/images/evidence_waste_spillage_1789743181414.jpg"
    }
]

class TicketCreate(BaseModel):
    title: str
    category: str
    priority: str
    priorityReason: Optional[str] = None
    ward: str
    landmark: Optional[str] = "Ahmedabad Ward"
    reporterName: Optional[str] = "Anonymous Citizen"
    civicScore: Optional[int] = 30
    hazardFlag: Optional[bool] = False
    imageUrl: Optional[str] = None
    description: Optional[str] = None

class TicketStatusUpdate(BaseModel):
    status: str  # "Open", "In Progress", "Resolved"

@router.get("", response_model=List[dict])
async def get_tickets(
    ward: Optional[str] = Query(None, description="Filter by Ward name"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status"),
    priority: Optional[str] = Query(None, description="Filter by priority")
):
    """
    Retrieve all active civic tickets with optional ward, status, and priority filtering.
    """
    results = TICKETS_DB
    if ward:
        results = [t for t in results if ward.lower() in t["ward"].lower()]
    if status_filter:
        results = [t for t in results if t["status"].lower() == status_filter.lower()]
    if priority:
        results = [t for t in results if t["priority"].lower() == priority.lower()]
    return results

@router.get("/{ticket_id}")
async def get_ticket(ticket_id: str):
    """
    Get detailed information for a specific civic ticket.
    """
    for ticket in TICKETS_DB:
        if ticket["id"] == ticket_id:
            return ticket
    raise HTTPException(status_code=404, detail="Ticket not found")

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_ticket(req: TicketCreate):
    """
    Submit a new geotagged civic defect ticket.
    """
    new_id = f"TICK-{len(TICKETS_DB) + 101}"
    new_ticket = {
        "id": new_id,
        "title": req.title,
        "category": req.category,
        "priority": req.priority,
        "priorityReason": req.priorityReason or "Visual hazard report submitted.",
        "status": "Open",
        "ward": req.ward,
        "landmark": req.landmark,
        "reporterName": req.reporterName,
        "civicScore": req.civicScore or 30,
        "hazardFlag": req.hazardFlag or False,
        "upvotes": 1,
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "estimatedSlaHours": 4 if req.priority == "High" else 12,
        "assignedSquad": f"{req.ward} Quick Action Unit",
        "imageUrl": req.imageUrl or "/src/assets/images/hero_city_illustration_1789740216032.jpg"
    }
    TICKETS_DB.insert(0, new_ticket)
    return {"success": True, "data": new_ticket}

@router.post("/{ticket_id}/upvote")
async def upvote_ticket(ticket_id: str):
    """
    Upvote a civic issue ticket to increase municipal visibility.
    """
    for ticket in TICKETS_DB:
        if ticket["id"] == ticket_id:
            ticket["upvotes"] += 1
            return {"success": True, "upvotes": ticket["upvotes"]}
    raise HTTPException(status_code=404, detail="Ticket not found")

@router.patch("/{ticket_id}/status")
async def update_ticket_status(ticket_id: str, body: TicketStatusUpdate):
    """
    Update ticket status (Open -> In Progress -> Resolved).
    """
    if body.status not in ["Open", "In Progress", "Resolved"]:
        raise HTTPException(status_code=400, detail="Invalid status value")

    for ticket in TICKETS_DB:
        if ticket["id"] == ticket_id:
            ticket["status"] = body.status
            return {"success": True, "ticket": ticket}
    raise HTTPException(status_code=404, detail="Ticket not found")
