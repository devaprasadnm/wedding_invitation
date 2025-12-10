-- Add 'romantic' template to templates table
INSERT INTO templates (id, name, slug) 
VALUES ('romantic', 'Romantic', 'romantic')
ON CONFLICT (id) DO NOTHING;
