-- Add map_url column to ceremonies table if it doesn't exist
ALTER TABLE ceremonies ADD COLUMN IF NOT EXISTS map_url TEXT;

-- Add notes column if it doesn't exist
ALTER TABLE ceremonies ADD COLUMN IF NOT EXISTS notes TEXT;
