-- Run this in your Supabase SQL Editor to update the courses table schema

ALTER TABLE courses
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS available_seats INTEGER,
ADD COLUMN IF NOT EXISTS total_students INTEGER DEFAULT 1200;

-- Optional: Update existing courses to match defaults
UPDATE courses SET total_students = 1200 WHERE total_students IS NULL;
UPDATE courses SET is_free = false WHERE is_free IS NULL;
