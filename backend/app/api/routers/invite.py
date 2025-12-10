from fastapi import APIRouter, HTTPException, Depends
from app.core.supabase import get_supabase_client
from app.models.schemas import InviteData, RSVPCreate, RSVP
from app.core.config import settings

router = APIRouter()

@router.get("/invite/{slug}", response_model=InviteData)
async def get_invite(slug: str):
    supabase = get_supabase_client()
    
    # 1. Get Client
    client_res = supabase.table("clients").select("*").eq("slug", slug).execute()
    if not client_res.data:
        raise HTTPException(status_code=404, detail="Invitation not found")
    client = client_res.data[0]
    client_id = client["id"]

    # 2. Get Ceremonies
    ceremonies_res = supabase.table("ceremonies").select("*").eq("client_id", client_id).execute()
    
    # 3. Get Photos
    photos_res = supabase.table("photos").select("*").eq("client_id", client_id).execute()
    photos = photos_res.data
    # Construct Public URLs
    for photo in photos:
        # Assuming path is stored like "client_slug/filename.jpg"
        photo["url"] = f"{settings.SUPABASE_URL}/storage/v1/object/public/client-photos/{photo['storage_path']}"

    # 4. Get Template
    template_id = client.get("template_id")
    template_res = supabase.table("templates").select("*").eq("id", template_id).execute()
    template = template_res.data[0] if template_res.data else None
    
    return {
        "client": client,
        "ceremonies": ceremonies_res.data,
        "photos": photos,
        "template": template
    }

@router.post("/invite/{slug}/rsvp", response_model=RSVP)
async def create_rsvp(slug: str, rsvp: RSVPCreate):
    supabase = get_supabase_client()
    
    # Get client id from slug
    client_res = supabase.table("clients").select("id").eq("slug", slug).execute()
    if not client_res.data:
        raise HTTPException(status_code=404, detail="Client not found")
    client_id = client_res.data[0]["id"]
    
    # Insert RSVP
    data = rsvp.dict()
    data["client_id"] = client_id
    
    res = supabase.table("rsvps").insert(data).execute()
    return res.data[0]
