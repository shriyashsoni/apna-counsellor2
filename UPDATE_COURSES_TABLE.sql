-- Comprehensive SQL Script to ensure all required columns exist in the 'courses' table

-- 1. Add all newly requested or previously missed columns safely
ALTER TABLE courses ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS original_price NUMERIC;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS discounted_price NUMERIC;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS discount_badge TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS level TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS total_lessons INTEGER;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS mode TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS color_accent TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS curriculum JSONB DEFAULT '[]'::jsonb;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]'::jsonb;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS promo_video_url TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS google_form_url TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS available_seats INTEGER;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS total_students INTEGER DEFAULT 1200;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS keywords TEXT[];

-- 2. Schema Cache Notes
-- Note: Supabase automatically detects schema changes. 
-- If you need to manually refresh the API cache, do it via Settings -> API -> Reload API Cache.
