from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str = "" # Optional if using client-side auth mainly, but needed for admin creation if not using JWT
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
