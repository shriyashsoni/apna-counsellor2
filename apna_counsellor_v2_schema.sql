-- =====================================================================
--  APNA COUNSELLOR v2 — COMPLETE SUPABASE SQL SETUP
--  Run this ENTIRE script in your Supabase SQL Editor once.
--  It is safe to run multiple times (idempotent).
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────────
-- 1. PROFILES TABLE (ensure it exists with all required columns)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    name TEXT,
    phone TEXT,
    city TEXT,
    role TEXT DEFAULT 'student',
    exam TEXT,
    category TEXT DEFAULT 'General',
    rank INTEGER,
    target_year TEXT DEFAULT '2026',
    onboarding_complete BOOLEAN DEFAULT false,
    avatar_url TEXT,
    is_visible BOOLEAN DEFAULT true,
    rating NUMERIC DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    pricing NUMERIC DEFAULT 499,
    college TEXT,
    branch TEXT,
    bio TEXT,
    counseling_type TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS exam TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rank INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_year TEXT DEFAULT '2026';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pricing NUMERIC DEFAULT 499;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS branch TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS counseling_type TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ─────────────────────────────────────────────────────────────────────
-- 2. AUTO-CREATE PROFILE ON AUTH SIGN UP
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.profiles.name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────
-- 3. COURSES TABLE
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    slug TEXT UNIQUE,
    category TEXT DEFAULT 'Counselling',
    level TEXT DEFAULT 'All Levels',
    language TEXT DEFAULT 'Hinglish',
    duration TEXT,
    mode TEXT DEFAULT 'Live Online',
    total_lessons INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    price NUMERIC NOT NULL DEFAULT 0,
    original_price NUMERIC,
    discounted_price NUMERIC,
    discount_badge TEXT,
    enrollment_deadline TIMESTAMP WITH TIME ZONE,
    max_seats INTEGER DEFAULT 0,
    enrolled_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'published',
    is_featured BOOLEAN DEFAULT false,
    visibility TEXT DEFAULT 'public',
    banner_url TEXT,
    thumbnail_url TEXT,
    promo_video_url TEXT,
    color_accent TEXT DEFAULT '#6d28d9',
    curriculum JSONB DEFAULT '[]'::jsonb,
    resources JSONB DEFAULT '[]'::jsonb,
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Add any missing columns to existing table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS promo_video_url TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS original_price NUMERIC;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS discounted_price NUMERIC;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS discount_badge TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS enrollment_deadline TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS max_seats INTEGER DEFAULT 0;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS enrolled_count INTEGER DEFAULT 0;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'Hinglish';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS total_sessions INTEGER DEFAULT 0;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'Live Online';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS color_accent TEXT DEFAULT '#6d28d9';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS keywords TEXT[];
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ─────────────────────────────────────────────────────────────────────
-- 4. COURSE ENROLLMENTS TABLE
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    payment_id TEXT,
    razorpay_order_id TEXT,
    amount_paid NUMERIC,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'refunded', 'completed', 'cancelled')),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    UNIQUE(course_id, student_id)
);

ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS amount_paid NUMERIC;
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- ─────────────────────────────────────────────────────────────────────
-- 5. LESSON PROGRESS TABLE
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    lesson_id TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(student_id, course_id, lesson_id)
);

-- ─────────────────────────────────────────────────────────────────────
-- 6. COURSE AUDIT LOGS TABLE
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.course_audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.course_audit_logs ADD COLUMN IF NOT EXISTS actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- ─────────────────────────────────────────────────────────────────────
-- 7. BLOGS TABLE
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- ─────────────────────────────────────────────────────────────────────
-- 8. MENTORS TABLE (dedicated mentor profiles)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mentors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- ─────────────────────────────────────────────────────────────────────
-- 9. SESSIONS TABLE
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'Counselling Session',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid_unscheduled', 'confirmed', 'completed', 'cancelled')),
    date TEXT,
    time_slot TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    meeting_link TEXT,
    student_name TEXT,
    mentor_name TEXT,
    notes TEXT,
    amount NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS notes TEXT;

-- ─────────────────────────────────────────────────────────────────────
-- 10. PAYMENTS TABLE
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    razorpay_payment_id TEXT UNIQUE,
    razorpay_order_id TEXT,
    razorpay_signature TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'captured', 'failed', 'refunded')),
    payment_type TEXT DEFAULT 'session' CHECK (payment_type IN ('session', 'course', 'subscription')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_type TEXT DEFAULT 'session';
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;

-- ─────────────────────────────────────────────────────────────────────
-- 11. NOTIFICATIONS TABLE
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    is_broadcast BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS is_broadcast BOOLEAN DEFAULT false;

-- ─────────────────────────────────────────────────────────────────────
-- 12. MENTOR APPLICATIONS TABLE
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mentor_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    college TEXT,
    branch TEXT,
    bio TEXT,
    counseling_type TEXT[],
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- ─────────────────────────────────────────────────────────────────────
-- 13. REVIEWS TABLE
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    UNIQUE(mentor_id, student_id, session_id)
);

-- ─────────────────────────────────────────────────────────────────────
-- 14. TRIGGERS
-- ─────────────────────────────────────────────────────────────────────

-- Auto-increment enrolled_count on new enrollment
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
    FOR EACH ROW EXECUTE FUNCTION public.increment_enrolled_count();

-- Auto-log student enrollment
CREATE OR REPLACE FUNCTION public.log_student_enrollment()
RETURNS TRIGGER AS $$
DECLARE
    course_title TEXT;
    student_email TEXT;
BEGIN
    SELECT title INTO course_title FROM public.courses WHERE id = NEW.course_id;
    SELECT email INTO student_email FROM public.profiles WHERE id = NEW.student_id;
    INSERT INTO public.course_audit_logs (action, details)
    VALUES ('student_enrolled',
      'Student (' || COALESCE(student_email, NEW.student_id::text) || ') enrolled in: ' || COALESCE(course_title, NEW.course_id::text));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_student_enrolled ON public.course_enrollments;
CREATE TRIGGER on_student_enrolled
    AFTER INSERT ON public.course_enrollments
    FOR EACH ROW EXECUTE FUNCTION public.log_student_enrollment();

-- ─────────────────────────────────────────────────────────────────────
-- 15. DISABLE RLS ON ALL TABLES (for admin operations)
--     Enable per-table policies selectively as needed
-- ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────
-- 16. VERIFY — show all created tables
-- ─────────────────────────────────────────────────────────────────────
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_name = t.table_name AND c.table_schema = 'public') AS column_count
FROM information_schema.tables t
WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
ORDER BY table_name;
