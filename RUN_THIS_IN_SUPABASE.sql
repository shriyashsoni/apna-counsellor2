-- ====================================================================
-- APNA COUNSELLOR v2 — FINAL COMPLETE SUPABASE DATABASE SETUP
-- Compatible with Firebase Authentication (no auth.users dependency)
-- ====================================================================
-- HOW TO RUN:
--   1. Go to supabase.com → Your Project → SQL Editor
--   2. Click "New Query"
--   3. Paste this ENTIRE file
--   4. Click "Run" (green button)
--   5. You'll see a table list at the bottom confirming success
-- ====================================================================

-- Step 0: Enable UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- STEP 1: DROP THE auth.users FOREIGN KEY if it exists
-- (Firebase users don't exist in auth.users — this was blocking inserts)
-- ====================================================================
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tc.constraint_name, tc.table_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
         AND tc.table_schema = kcu.table_schema
        JOIN information_schema.referential_constraints rc
          ON tc.constraint_name = rc.constraint_name
        JOIN information_schema.table_constraints ccu
          ON rc.unique_constraint_name = ccu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_schema = 'public'
          AND tc.table_name = 'profiles'
          AND ccu.table_name = 'users'
          AND ccu.table_schema = 'auth'
    ) LOOP
        EXECUTE 'ALTER TABLE public.' || r.table_name ||
                ' DROP CONSTRAINT IF EXISTS ' || r.constraint_name || ' CASCADE';
    END LOOP;
END;
$$;

-- ====================================================================
-- TABLE 1: PROFILES
-- Stores every user (student, mentor, admin) — Firebase-compatible
-- id is a plain UUID, NOT linked to auth.users
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE,
    name TEXT,
    phone TEXT,
    city TEXT,
    role TEXT DEFAULT 'student',
    exam TEXT,
    category TEXT DEFAULT 'General',
    rank INTEGER,
    target_year TEXT,
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
    interested_states TEXT[],
    firebase_uid TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Add missing columns to profiles if table already existed
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS exam TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rank INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_year TEXT;
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
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interested_states TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS firebase_uid TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- Create unique index on firebase_uid (for fast lookups on login)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_firebase_uid_idx ON public.profiles(firebase_uid) WHERE firebase_uid IS NOT NULL;

-- ====================================================================
-- TABLE 2: COURSES
-- All admission counselling courses published by admin
-- ====================================================================
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

-- Add missing columns to courses if table already existed
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
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS curriculum JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]'::jsonb;

-- ====================================================================
-- TABLE 3: COURSE_ENROLLMENTS
-- Records which student paid and enrolled in which course
-- ====================================================================
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

-- ====================================================================
-- TABLE 4: LESSON_PROGRESS
-- Tracks which lessons each student has completed
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    lesson_id TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(student_id, course_id, lesson_id)
);

-- ====================================================================
-- TABLE 5: COURSE_AUDIT_LOGS
-- Every admin action gets logged here automatically
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.course_audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.course_audit_logs ADD COLUMN IF NOT EXISTS actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- ====================================================================
-- TABLE 6: BLOGS
-- Blog posts and admission guides published by admin
-- ====================================================================
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

ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS body_html TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS exam_types TEXT[] DEFAULT '{}';
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS author_avatar TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS author_role TEXT DEFAULT 'Admission Expert';
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS og_image_url TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS cover_alt_text TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS focus_keyword TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS schema_type TEXT DEFAULT 'Article';
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS faq_items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN DEFAULT true;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS newsletter_push BOOLEAN DEFAULT false;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- ====================================================================
-- TABLE 7: SESSIONS
-- 1-on-1 mentor consultation session bookings
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'Counselling Session',
    status TEXT DEFAULT 'pending' CHECK (
        status IN ('pending','paid_unscheduled','confirmed','completed','cancelled')
    ),
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
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS amount NUMERIC;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS mentor_name TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS meeting_link TEXT;

-- ====================================================================
-- TABLE 8: PAYMENTS
-- All Razorpay payment records for sessions and courses
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    razorpay_payment_id TEXT UNIQUE,
    razorpay_order_id TEXT,
    razorpay_signature TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','captured','failed','refunded')),
    payment_type TEXT DEFAULT 'session' CHECK (payment_type IN ('session','course','subscription')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_type TEXT DEFAULT 'session';
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;

-- ====================================================================
-- TABLE 9: NOTIFICATIONS
-- In-app alerts sent to students (broadcast + individual)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info','success','warning','error')),
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    is_broadcast BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS is_broadcast BOOLEAN DEFAULT false;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS link TEXT;

-- ====================================================================
-- TABLE 10: MENTOR_APPLICATIONS
-- Submitted by users who want to become mentors
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.mentor_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    college TEXT,
    branch TEXT,
    bio TEXT,
    counseling_type TEXT[],
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.mentor_applications ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

-- ====================================================================
-- TABLE 11: REVIEWS
-- Student reviews and ratings for mentor sessions
-- ====================================================================
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

-- ====================================================================
-- TABLE 12: COLLEGES
-- College database for predictors and rankings
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.colleges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    state TEXT,
    city TEXT,
    category TEXT,
    nirf_rank INTEGER,
    exam_type TEXT,
    website TEXT,
    logo_url TEXT,
    cutoffs JSONB DEFAULT '{}'::jsonb,
    branches TEXT[] DEFAULT '{}',
    slug TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS cutoffs JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS branches TEXT[] DEFAULT '{}';
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS nirf_rank INTEGER;

-- ====================================================================
-- TRIGGER A: Auto-increment enrolled_count when student enrolls
-- ====================================================================
CREATE OR REPLACE FUNCTION public.increment_enrolled_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.courses
    SET enrolled_count = COALESCE(enrolled_count, 0) + 1,
        updated_at = timezone('utc', now())
    WHERE id = NEW.course_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_enrollment_increment ON public.course_enrollments;
CREATE TRIGGER on_enrollment_increment
    AFTER INSERT ON public.course_enrollments
    FOR EACH ROW EXECUTE FUNCTION public.increment_enrolled_count();

-- ====================================================================
-- TRIGGER B: Auto-log every enrollment into audit logs
-- ====================================================================
CREATE OR REPLACE FUNCTION public.log_student_enrollment()
RETURNS TRIGGER AS $$
DECLARE
    v_course_title TEXT;
    v_student_email TEXT;
BEGIN
    SELECT title INTO v_course_title FROM public.courses WHERE id = NEW.course_id;
    SELECT email INTO v_student_email FROM public.profiles WHERE id = NEW.student_id;
    INSERT INTO public.course_audit_logs (action, details, actor_id)
    VALUES (
        'student_enrolled',
        'Student (' || COALESCE(v_student_email, NEW.student_id::text) ||
        ') enrolled in: ' || COALESCE(v_course_title, NEW.course_id::text),
        NEW.student_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_student_enrolled ON public.course_enrollments;
CREATE TRIGGER on_student_enrolled
    AFTER INSERT ON public.course_enrollments
    FOR EACH ROW EXECUTE FUNCTION public.log_student_enrollment();

-- ====================================================================
-- TRIGGER C: Auto-update mentor rating when a new review is added
-- ====================================================================
CREATE OR REPLACE FUNCTION public.update_mentor_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET
        rating = (
            SELECT ROUND(AVG(rating)::numeric, 1)
            FROM public.reviews
            WHERE mentor_id = NEW.mentor_id
        ),
        reviews_count = (
            SELECT COUNT(*)
            FROM public.reviews
            WHERE mentor_id = NEW.mentor_id
        ),
        updated_at = timezone('utc', now())
    WHERE id = NEW.mentor_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_added ON public.reviews;
CREATE TRIGGER on_review_added
    AFTER INSERT OR UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_mentor_rating();

-- ====================================================================
-- TRIGGER D: Auto-update profiles.updated_at on any change
-- ====================================================================
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS courses_updated_at ON public.courses;
CREATE TRIGGER courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ====================================================================
-- DISABLE ROW LEVEL SECURITY ON ALL TABLES
-- Firebase handles auth — Supabase just stores data
-- All queries go through service role key (server) or anon key (client)
-- ====================================================================
ALTER TABLE public.profiles             DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses              DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments   DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress      DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_audit_logs    DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs                DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions             DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments             DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications        DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_applications  DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews              DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges             DISABLE ROW LEVEL SECURITY;

-- ====================================================================
-- GRANT PERMISSIONS TO anon AND authenticated ROLES
-- This ensures the frontend (anon key) can read/write data
-- ====================================================================
GRANT ALL ON public.profiles            TO anon, authenticated;
GRANT ALL ON public.courses             TO anon, authenticated;
GRANT ALL ON public.course_enrollments  TO anon, authenticated;
GRANT ALL ON public.lesson_progress     TO anon, authenticated;
GRANT ALL ON public.course_audit_logs   TO anon, authenticated;
GRANT ALL ON public.blogs               TO anon, authenticated;
GRANT ALL ON public.sessions            TO anon, authenticated;
GRANT ALL ON public.payments            TO anon, authenticated;
GRANT ALL ON public.notifications       TO anon, authenticated;
GRANT ALL ON public.mentor_applications TO anon, authenticated;
GRANT ALL ON public.reviews             TO anon, authenticated;
GRANT ALL ON public.colleges            TO anon, authenticated;

-- ====================================================================
-- VERIFICATION: Run this to confirm all 12 tables were created
-- You will see a list of table names and column counts
-- ====================================================================
SELECT
    t.table_name,
    COUNT(c.column_name) AS column_count
FROM information_schema.tables t
JOIN information_schema.columns c
    ON c.table_name = t.table_name AND c.table_schema = 'public'
WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
  AND t.table_name IN (
    'profiles','courses','course_enrollments','lesson_progress',
    'course_audit_logs','blogs','sessions','payments',
    'notifications','mentor_applications','reviews','colleges'
  )
GROUP BY t.table_name
ORDER BY t.table_name;
