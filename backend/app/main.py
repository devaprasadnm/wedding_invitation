from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="Wedding Invitation API",
    description="Backend for the Wedding Invitation Platform",
    version="1.0.0",
)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost:5173", # Vite default
    "https://wedding-invite-app.com", # Placeholder for production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Wedding API is running"}

from app.api.routers import admin, invite

app.include_router(admin.router, prefix="/api", tags=["Admin"])
app.include_router(invite.router, prefix="/api", tags=["Public Invite"])

