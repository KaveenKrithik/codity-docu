-- =====================================================
-- SUPABASE DATABASE SCHEMA FOR CODITY DOCUMENTATION
-- =====================================================

-- 1. Create the docs table
CREATE TABLE IF NOT EXISTS docs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create an index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_docs_slug ON docs(slug);

-- 3. Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_docs_created_at ON docs(created_at DESC);

-- 4. Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create a trigger to call the function before updates
DROP TRIGGER IF EXISTS update_docs_updated_at ON docs;
CREATE TRIGGER update_docs_updated_at
  BEFORE UPDATE ON docs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STORAGE BUCKET SETUP (Run in Supabase Dashboard)
-- =====================================================

-- NOTE: Storage buckets must be created via the Supabase Dashboard or Storage API
-- Go to: Storage > Create a new bucket
-- Bucket name: docs
-- Public bucket: NO (keep it private for now, or YES if you want public access)

-- If you want to create it via SQL (requires supabase_admin role):
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('docs', 'docs', false);

-- =====================================================
-- STORAGE POLICIES (Optional - for Row Level Security)
-- =====================================================

-- If your bucket is private, you'll need policies to allow access
-- These examples assume you're using service role key in your API routes

-- Allow authenticated users to read files
CREATE POLICY "Allow authenticated users to read docs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'docs');

-- Allow service role to insert files
CREATE POLICY "Allow service role to insert docs"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'docs');

-- Allow service role to update files
CREATE POLICY "Allow service role to update docs"
ON storage.objects FOR UPDATE
TO service_role
USING (bucket_id = 'docs');

-- Allow service role to delete files
CREATE POLICY "Allow service role to delete docs"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'docs');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if the table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'docs'
);

-- View table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'docs'
ORDER BY ordinal_position;

-- Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'docs';

-- Check triggers
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'docs';
