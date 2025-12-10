from supabase import create_client, Client
from app.core.config import settings

# Initialize Supabase Client
# Using the Service Role key allows bypassing RLS for Admin operations performed by the backend
# Be careful to checks permissions if exposing endpoints.
# Alternatively, we can use the anon key and pass the user's JWT for RLS.

# Primary client (Service Role for Admin ops)
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def get_supabase_client() -> Client:
    return supabase
