# Production & Security Checklist

## Environment Variables
Ensure these are set in your deployment environment (e.g. Google Cloud Run, Vercel, etc).

```env
# Backend (.env)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SECRET_KEY=generate-a-strong-random-string

# Frontend (.env.production)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
```

## Security Best Practices
1. **Row Level Security (RLS)**: Ensure all Supabase tables have RLS enabled.
    - `admins`: Only service_role or self can read.
    - `clients`, `photos`: Public read (for invites), Admin write.
    - `rsvps`: Public insert, Admin read.
2. **CORS**: Configure FastAPI CORS to only allow your frontend domain (e.g. `https://your-wedding-app.com`).
3. **Storage Policies**:
    - `client-photos` bucket: Public Read, Auth Insert/Update.
4. **Input Validation**: Backend Pydantic models validate all inputs. Frontend TS provides first layer of defense.
5. **Rate Limiting**: Implementation pending (Recommended: `slowapi` on FastAPI).

## Deployment Steps (Google Cloud Run)
1. **Build Containers**:
   ```bash
   docker build -t gcr.io/PROJECT_ID/wedding-backend ./backend
   docker build -t gcr.io/PROJECT_ID/wedding-frontend ./frontend
   ```
2. **Push**:
   ```bash
   docker push gcr.io/PROJECT_ID/wedding-backend
   docker push gcr.io/PROJECT_ID/wedding-frontend
   ```
3. **Deploy Backend**:
   ```bash
   gcloud run deploy wedding-backend --image gcr.io/PROJECT_ID/wedding-backend --platform managed --allow-unauthenticated --set-env-vars SUPABASE_URL=...,SUPABASE_KEY=...
   ```
4. **Deploy Frontend**:
   (Recommended to deploy Frontend to Vercel/Netlify for better edge performance, or Cloud Run serving static files via Nginx).
