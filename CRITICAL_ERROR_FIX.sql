-- ====================================================================
--        APNA COUNSELLOR — CRITICAL SYSTEM ERROR FIX
-- ====================================================================
-- Run this ENTIRE script in Supabase → SQL Editor → New Query → Run
-- This fixes the "Critical System Error" after login.
-- Safe to run multiple times (fully idempotent).
-- ====================================================================


-- ====================================================================
-- STEP 1: ENSURE ALL REQUIRED TABLES EXIST
-- ====================================================================

-- course_queries (created by LATEST_SQL_UPDATE.sql — make sure it's there)
CREATE TABLE IF NOT EXISTS public.course_queries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- lesson_progress (referenced in FINAL_RLS_FIX.sql but may not exist)
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id TEXT,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- notifications (ensure it exists with all required columns)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    is_broadcast BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- course_enrollments (ensure it exists)
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    access_expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(course_id, student_id)
);

-- course_audit_logs (ensure it exists)
CREATE TABLE IF NOT EXISTS public.course_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);


-- ====================================================================
-- STEP 2: ADD ALL MISSING COLUMNS (safe — uses IF NOT EXISTS)
-- ====================================================================

-- notifications: columns added by LATEST_SQL_UPDATE.sql
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS target_group TEXT DEFAULT 'all';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS is_broadcast BOOLEAN DEFAULT false;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS link TEXT;

-- course_enrollments: columns added by LATEST_SQL_UPDATE.sql
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS amount NUMERIC;

-- profiles: safe adds
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS razorpay_account_id TEXT;

-- courses: all columns from FINAL_DB_UPDATE.sql
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
-- STEP 3: ENABLE RLS ON ALL TABLES (safe — won't error if already on)
-- ====================================================================

ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_audit_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_queries       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications        ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.mentor_applications ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.counselings ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN NULL; END $$;


-- ====================================================================
-- STEP 4: DROP ALL OLD POLICIES (clean slate)
-- ====================================================================

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;


-- ====================================================================
-- STEP 5: RECREATE ALL POLICIES — "OPEN READ" STRATEGY
-- (Firebase Auth users appear as anon to Supabase, so anon needs SELECT)
-- Writes are handled via service_role through your API routes.
-- ====================================================================

-- PROFILES
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT TO anon, authenticated USING (true);

-- COURSES
CREATE POLICY "courses_select_all" ON public.courses
  FOR SELECT TO anon, authenticated USING (true);

-- COLLEGES
DO $$ BEGIN
  CREATE POLICY "colleges_select_all" ON public.colleges
    FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN undefined_table THEN NULL; END $$;

-- BLOGS
DO $$ BEGIN
  CREATE POLICY "blogs_select_all" ON public.blogs
    FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN undefined_table THEN NULL; END $$;

-- COUNSELINGS
DO $$ BEGIN
  CREATE POLICY "counselings_select_all" ON public.counselings
    FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN undefined_table THEN NULL; END $$;

-- REVIEWS
DO $$ BEGIN
  CREATE POLICY "reviews_select_all" ON public.reviews
    FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN undefined_table THEN NULL; END $$;

-- COURSE ENROLLMENTS
CREATE POLICY "enrollments_select_all" ON public.course_enrollments
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "enrollments_insert_all" ON public.course_enrollments
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "enrollments_update_all" ON public.course_enrollments
  FOR UPDATE TO anon, authenticated USING (true);

-- SESSIONS
DO $$ BEGIN
  CREATE POLICY "sessions_select_all" ON public.sessions
    FOR SELECT TO anon, authenticated USING (true);
  CREATE POLICY "sessions_insert_all" ON public.sessions
    FOR INSERT TO anon, authenticated WITH CHECK (true);
  CREATE POLICY "sessions_update_all" ON public.sessions
    FOR UPDATE TO anon, authenticated USING (true);
EXCEPTION WHEN undefined_table THEN NULL; END $$;

-- PAYMENTS
DO $$ BEGIN
  CREATE POLICY "payments_select_all" ON public.payments
    FOR SELECT TO anon, authenticated USING (true);
  CREATE POLICY "payments_insert_all" ON public.payments
    FOR INSERT TO anon, authenticated WITH CHECK (true);
EXCEPTION WHEN undefined_table THEN NULL; END $$;

-- NOTIFICATIONS (critical — dashboard fetches these after login)
CREATE POLICY "notifications_select_all" ON public.notifications
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "notifications_insert_all" ON public.notifications
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "notifications_update_all" ON public.notifications
  FOR UPDATE TO anon, authenticated USING (true);

CREATE POLICY "notifications_delete_all" ON public.notifications
  FOR DELETE TO anon, authenticated USING (true);

-- COURSE QUERIES (new table from LATEST_SQL_UPDATE.sql)
CREATE POLICY "course_queries_select_all" ON public.course_queries
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "course_queries_insert_all" ON public.course_queries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "course_queries_update_all" ON public.course_queries
  FOR UPDATE TO anon, authenticated USING (true);

-- LESSON PROGRESS
CREATE POLICY "lesson_progress_select_all" ON public.lesson_progress
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "lesson_progress_insert_all" ON public.lesson_progress
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "lesson_progress_update_all" ON public.lesson_progress
  FOR UPDATE TO anon, authenticated USING (true);

-- COURSE AUDIT LOGS
CREATE POLICY "audit_logs_select_all" ON public.course_audit_logs
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "audit_logs_insert_all" ON public.course_audit_logs
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- MENTOR APPLICATIONS
DO $$ BEGIN
  CREATE POLICY "mentor_apps_select_all" ON public.mentor_applications
    FOR SELECT TO anon, authenticated USING (true);
  CREATE POLICY "mentor_apps_insert_all" ON public.mentor_applications
    FOR INSERT TO anon, authenticated WITH CHECK (true);
EXCEPTION WHEN undefined_table THEN NULL; END $$;


-- ====================================================================
-- STEP 6: GRANT API ACCESS ON ALL TABLES
-- ====================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant on all existing tables dynamically
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE 'GRANT ALL ON TABLE public.' || quote_ident(r.table_name) || ' TO anon, authenticated, service_role;';
    END LOOP;
END $$;

-- Grant on all sequences
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Ensure future tables also get access automatically
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL ON TABLES TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;


-- ====================================================================
-- STEP 7: ENABLE REALTIME (safe — won't duplicate if already added)
-- ====================================================================

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.course_queries;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ====================================================================
-- STEP 8: VERIFY — Check the fix worked
-- ====================================================================

SELECT 
  tablename, 
  rowsecurity AS rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

SELECT 
  tablename, 
  policyname, 
  cmd,
  roles
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
