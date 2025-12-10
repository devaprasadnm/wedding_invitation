from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from typing import List, Optional
from app.core.supabase import get_supabase_client
from app.models.schemas import Client, ClientCreate, CeremonyCreate, Photo
from app.api.deps import get_current_user
from app.core.config import settings
import uuid 
# import pillow for resizing logic later

router = APIRouter()

@router.get("/admin/clients", response_model=List[Client])
async def list_clients(user = Depends(get_current_user)):
    supabase = get_supabase_client()
    res = supabase.table("clients").select("*").execute()
    return res.data

@router.post("/admin/clients", response_model=Client)
async def create_client(client: ClientCreate, user = Depends(get_current_user)):
    supabase = get_supabase_client()
    
    # Basic slug collision check
    slug = client.slug
    exists = supabase.table("clients").select("id").eq("slug", slug).execute()
    if exists.data:
        # Simple collision handling: append rand
        slug = f"{slug}-{uuid.uuid4().hex[:4]}"
    
    data = client.dict()
    data["slug"] = slug
    
    res = supabase.table("clients").insert(data).execute()
    return res.data[0]

@router.post("/admin/clients/{client_id}/ceremonies")
async def add_ceremony(client_id: str, ceremony: CeremonyCreate, user = Depends(get_current_user)):
    supabase = get_supabase_client()
    data = ceremony.dict()
    data["client_id"] = client_id
    res = supabase.table("ceremonies").insert(data).execute()
    return res.data[0]

@router.post("/admin/clients/{client_id}/photos")
async def upload_photo(
    client_id: str, 
    file: UploadFile = File(...),
    user = Depends(get_current_user)
):
    supabase = get_supabase_client()
    
    # Get client slug for path
    client = supabase.table("clients").select("slug").eq("id", client_id).execute()
    if not client.data:
        raise HTTPException(404, "Client not found")
    slug = client.data[0]["slug"]
    
    # Read file (in strict production, validate bytes/mime here with python-magic)
    file_bytes = await file.read()
    
    # Upload to Supabase Storage
    path = f"{slug}/{file.filename}"
    storage_res = supabase.storage.from_("client-photos").upload(
        path=path,
        file=file_bytes,
        file_options={"content-type": file.content_type} # Use actual mine
    )
    
    # Save Metadata to DB
    photo_data = {
        "client_id": client_id,
        "storage_path": path,
        "filename": file.filename,
        "width": 1024, # Mock width for now, need Pillow to get real dims
        "height": 768
    }
    db_res = supabase.table("photos").insert(photo_data).execute()
    
    return db_res.data[0]
