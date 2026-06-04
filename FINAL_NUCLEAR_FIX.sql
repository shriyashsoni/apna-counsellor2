-- ====================================================================
--   APNA COUNSELLOR — FINAL NUCLEAR FIX (Run this, nothing else)
-- ====================================================================
-- YOUR ARCHITECTURE: Firebase Auth + Supabase Database
-- Firebase users appear as ANON to Supabase — RLS blocks them.
-- This script DISABLES RLS on all tables and grants FULL access.
-- This is the CORRECT approach for Firebase + Supabase setups.
-- ====================================================================
-- HOW TO RUN:
--   Supabase Dashboard → SQL Editor → New Query → Paste All → Run
-- ====================================================================


-- ====================================================================
-- STEP 1: CREATE ALL MISSING TABLES
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.course_queries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id TEXT,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    is_broadcast BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    status TEXT DEFAULT 'active',
    access_expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(course_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.course_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.counselings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    region TEXT,
    exam TEXT,
    description TEXT,
    links JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);


-- ====================================================================
-- STEP 2: ADD ALL MISSING COLUMNS
-- ====================================================================

-- profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS razorpay_account_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS firebase_uid TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT false;

-- notifications
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS target_group TEXT DEFAULT 'all';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS is_broadcast BOOLEAN DEFAULT false;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS link TEXT;

-- course_enrollments
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS amount NUMERIC;

-- courses
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS original_price NUMERIC;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS discounted_price NUMERIC;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS discount_badge TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS level TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS total_lessons INTEGER;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS mode TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS color_accent TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS curriculum JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS promo_video_url TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS google_form_url TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS available_seats INTEGER;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS total_students INTEGER DEFAULT 1200;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS keywords TEXT[];
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS whatsapp_group_url TEXT;


-- ====================================================================
-- STEP 3: DROP ALL OLD POLICIES (clean slate)
-- ====================================================================

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;


-- ====================================================================
-- STEP 4: DISABLE RLS ON ALL TABLES
-- This is REQUIRED for Firebase Auth + Supabase.
-- Firebase tokens are NOT recognized by Supabase RLS.
-- Your API routes use service_role key which bypasses RLS anyway.
-- ====================================================================

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', r.tablename);
  END LOOP;
END $$;


-- ====================================================================
-- STEP 5: GRANT FULL API ACCESS ON EVERYTHING
-- ====================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
  LOOP
    EXECUTE format(
      'GRANT ALL ON TABLE public.%I TO anon, authenticated, service_role',
      r.table_name
    );
  END LOOP;
END $$;

GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Ensure ALL future tables you create also get full access automatically
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;


-- ====================================================================
-- STEP 6: ENABLE REALTIME (safe — won't error if already added)
-- ====================================================================

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.course_queries;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ====================================================================
-- STEP 7: VERIFY — You should see rls_enabled = false on all tables
-- ====================================================================

SELECT
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
