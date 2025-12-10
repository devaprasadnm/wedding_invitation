from pydantic import BaseModel, EmailStr, HttpUrl
from typing import List, Optional, Any, Dict
from datetime import datetime
from uuid import UUID

# --- Shared Models ---

class ClientBase(BaseModel):
    couple_name: str
    contact_email: EmailStr
    slug: str
    template_id: str

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    couple_name: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    template_id: Optional[str] = None
    # Slug is usually not updated to prevent broken links, or requires special handling

class Client(ClientBase):
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Ceremony Models ---

class CeremonyBase(BaseModel):
    title: str
    date_time: datetime
    venue: str
    map_url: Optional[str] = None
    notes: Optional[str] = None

class CeremonyCreate(CeremonyBase):
    pass # client_id handled by backend

class Ceremony(CeremonyBase):
    id: UUID
    client_id: UUID
    created_at: datetime

# --- Photo Models ---

class Photo(BaseModel):
    id: UUID
    client_id: UUID
    storage_path: str
    filename: str
    width: Optional[int]
    height: Optional[int]
    created_at: datetime
    # Computed URL property to be added in response
    url: Optional[str] = None

# --- RSVP Models ---

class RSVPCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    response: str # yes, no, maybe
    message: Optional[str] = None

class RSVP(RSVPCreate):
    id: UUID
    client_id: UUID
    created_at: datetime

# --- Template Models ---

class Template(BaseModel):
    id: str
    name: str
    slug: str
    config: Dict[str, Any]

# --- Composite Response Models ---

class InviteData(BaseModel):
    client: Client
    ceremonies: List[Ceremony]
    photos: List[Photo]
    template: Template

