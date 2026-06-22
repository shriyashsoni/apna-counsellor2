-- =========================================================================================
-- FIX FOR SUPABASE STORAGE RLS POLICIES & BUCKET CREATION (SAFE VERSION)
-- =========================================================================================
-- This version removes the restricted `ALTER TABLE` and `GRANT` statements which cause
-- owner/permissions errors on Supabase's managed `storage` schema tables.
--
-- INSTRUCTIONS: Copy the entire script, go to Supabase -> SQL Editor -> New Query, paste, and run.
-- =========================================================================================

-- 1. Create the required storage buckets if they do not exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('course-materials', 'course-materials', true),
  ('course-images', 'course-images', true),
  ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Clean up any conflicting existing policies
DROP POLICY IF EXISTS "Public Read Access on course-materials" ON storage.objects;
DROP POLICY IF EXISTS "All Access on course-materials" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access on course-images" ON storage.objects;
DROP POLICY IF EXISTS "All Access on course-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access on profiles" ON storage.objects;
DROP POLICY IF EXISTS "All Access on profiles" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete" ON storage.objects;

-- 3. Create Policies for 'course-materials'
CREATE POLICY "Public Read Access on course-materials" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'course-materials');

CREATE POLICY "All Access on course-materials" ON storage.objects
  FOR ALL TO public 
  USING (bucket_id = 'course-materials') 
  WITH CHECK (bucket_id = 'course-materials');

-- 4. Create Policies for 'course-images'
CREATE POLICY "Public Read Access on course-images" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'course-images');

CREATE POLICY "All Access on course-images" ON storage.objects
  FOR ALL TO public 
  USING (bucket_id = 'course-images') 
  WITH CHECK (bucket_id = 'course-images');

-- 5. Create Policies for 'profiles'
CREATE POLICY "Public Read Access on profiles" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'profiles');

CREATE POLICY "All Access on profiles" ON storage.objects
  FOR ALL TO public 
  USING (bucket_id = 'profiles') 
  WITH CHECK (bucket_id = 'profiles');
