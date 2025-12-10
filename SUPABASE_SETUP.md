# Supabase Setup Guide

## 1. Create Project
1. Go to [database.new](https://database.new) and create a new project.
2. Save your `Reference ID`, `Project URL`, and `API Keys` (Anon, Service Role).

## 2. Run Database Migrations
You can run the SQL script in the Supabase Dashboard SQL Editor.
1. Open `supabase/migrations/20251210123500_initial_schema.sql`.
2. Copy the content.
3. Paste into the Supabase SQL Editor and run it.

## 3. Storage Setup
1. Go to **Storage** in the dashboard.
2. Create a new bucket named `client-photos`.
3. Toggle "Public Bucket" to **ON**.
4. Add a policy for the bucket:
   - SELECT: Enable for all (public).
   - INSERT: Enable for Authenticated users (Admins).
   - UPDATE/DELETE: Enable for Authenticated users.

## 4. Auth Setup
1. Go to **Authentication** -> **Providers**.
2. Enable Email/Password.
3. Disable "Confirm email" if you want instant login for testing.

## 5. Environment Variables
Copy these to your local `.env`:
```
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```
