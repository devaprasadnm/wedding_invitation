-- Settings table for company information
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT DEFAULT 'InviteLeaf',
    company_phone TEXT,
    company_email TEXT,
    company_website TEXT,
    company_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings (for footer display)
CREATE POLICY "Public can view settings" ON settings
    FOR SELECT USING (true);

-- Allow authenticated users to manage settings
CREATE POLICY "Authenticated users can manage settings" ON settings
    FOR ALL USING (auth.role() = 'authenticated');
