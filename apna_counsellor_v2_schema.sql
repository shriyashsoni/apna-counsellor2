-- =====================================================================
--  APNA COUNSELLOR v2 — MASTER DATABASE SCHEMA UPGRADE
--  Run this entire script in your Supabase SQL Editor.
--  Safe to run multiple times (uses IF NOT EXISTS / IF NOT EXISTS checks)
-- =====================================================================

-- ─────────────────────────────────────────────────────────────────────
-- 1.  COURSES TABLE — extend existing table with v2 columns
-- ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS promo_video_url TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS original_price NUMERIC;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS discounted_price NUMERIC;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS discount_badge TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS enrollment_deadline TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS max_seats INTEGER DEFAULT 0;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'Hinglish';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS total_sessions INTEGER DEFAULT 0;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'Live Online';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS color_accent TEXT DEFAULT '#00FF88';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS keywords TEXT[];
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS enrolled_count INTEGER DEFAULT 0;

-- Backfill status from is_published for existing rows
UPDATE public.courses SET status = CASE WHEN is_published THEN 'published' ELSE 'draft' END
WHERE status IS NULL;

-- ─────────────────────────────────────────────────────────────────────
-- 2.  LESSON PROGRESS TABLE — track classroom completion per student
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    lesson_id TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(student_id, course_id, lesson_id)
);

-- ─────────────────────────────────────────────────────────────────────
-- 3.  MENTORS TABLE — dedicated mentor profiles (separate from profiles)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mentors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    email TEXT,
    phone TEXT,
    city TEXT,
    avatar_url TEXT,
    bio_short TEXT,
    bio_long TEXT,
    current_role TEXT,
    company TEXT,
    experience_years INTEGER DEFAULT 0,
    linkedin_url TEXT,
    portfolio_url TEXT,
    specializations TEXT[] DEFAULT '{}',
    domain_tags TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{English}',
    session_price NUMERIC DEFAULT 499,
    free_discovery_call BOOLEAN DEFAULT false,
    available_days TEXT[] DEFAULT '{}',
    slot_duration INTEGER DEFAULT 60,
    booking_link TEXT,
    achievements JSONB DEFAULT '[]'::jsonb,
    colleges_accepted JSONB DEFAULT '[]'::jsonb,
    video_testimonial_url TEXT,
    status TEXT DEFAULT 'active',
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    sessions_done INTEGER DEFAULT 0,
    rating NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─────────────────────────────────────────────────────────────────────
-- 4.  BLOGS TABLE — full blog post management
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subtitle TEXT,
    body TEXT,
    body_html TEXT,
    category TEXT DEFAULT 'College Admissions',
    tags TEXT[] DEFAULT '{}',
    exam_types TEXT[] DEFAULT '{}',
    author_name TEXT DEFAULT 'Apna Counsellor Team',
    author_avatar TEXT,
    author_role TEXT DEFAULT 'Admission Expert',
    cover_image_url TEXT,
    og_image_url TEXT,
    cover_alt_text TEXT,
    meta_title TEXT,
    meta_description TEXT,
    focus_keyword TEXT,
    schema_type TEXT DEFAULT 'Article',
    faq_items JSONB DEFAULT '[]'::jsonb,
    read_time_minutes INTEGER DEFAULT 5,
    status TEXT DEFAULT 'draft',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    is_featured BOOLEAN DEFAULT false,
    allow_comments BOOLEAN DEFAULT true,
    newsletter_push BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─────────────────────────────────────────────────────────────────────
-- 5.  DISABLE RLS ON NEW TABLES (permissive for admin ops)
--     Enable selectively per your security requirements
-- ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.lesson_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs DISABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────
-- 6.  TRIGGER — auto-increment enrolled_count on new enrollment
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.increment_enrolled_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.courses
    SET enrolled_count = COALESCE(enrolled_count, 0) + 1
    WHERE id = NEW.course_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_enrollment_increment ON public.course_enrollments;
CREATE TRIGGER on_enrollment_increment
    AFTER INSERT ON public.course_enrollments
    FOR EACH ROW EXECUTE PROCEDURE public.increment_enrolled_count();

-- ─────────────────────────────────────────────────────────────────────
-- 7.  STORAGE BUCKETS — create required public media buckets
--     Run these via Supabase Dashboard → Storage → New Bucket
--     OR uncomment if using supabase_admin role:
-- ─────────────────────────────────────────────────────────────────────
-- INSERT INTO storage.buckets (id, name, public) VALUES ('course-banners', 'course-banners', true) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('course-thumbnails', 'course-thumbnails', true) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('mentor-avatars', 'mentor-avatars', true) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('blog-covers', 'blog-covers', true) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('course-resources', 'course-resources', false) ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- 8.  VERIFY — list all created tables
-- ─────────────────────────────────────────────────────────────────────
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('courses','course_enrollments','lesson_progress','mentors','blogs','profiles','course_audit_logs')
ORDER BY table_name;
