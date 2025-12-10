-- Run this in your Supabase SQL Editor to fix RLS policies

-- Allow authenticated users (admins) to insert clients
CREATE POLICY "Authenticated users can insert clients" ON clients
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update clients
CREATE POLICY "Authenticated users can update clients" ON clients
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete clients
CREATE POLICY "Authenticated users can delete clients" ON clients
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Same for ceremonies
CREATE POLICY "Authenticated users can insert ceremonies" ON ceremonies
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update ceremonies" ON ceremonies
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Same for photos
CREATE POLICY "Authenticated users can insert photos" ON photos
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update photos" ON photos
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- RSVPs - already allows public insert, but let's ensure admins can read
CREATE POLICY "Authenticated users can read rsvps" ON rsvps
  FOR SELECT
  USING (auth.role() = 'authenticated');
