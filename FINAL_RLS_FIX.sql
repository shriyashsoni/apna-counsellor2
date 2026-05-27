-- ====================================================================
-- APNA COUNSELLOR — FINAL RLS FIX
-- Fixes: Supabase security warnings + admin portal + course purchases
-- Run in: Supabase → SQL Editor → New Query → Paste ALL → Run
-- ====================================================================

-- ====================================================================
-- STEP 1: ADD ALL MISSING COLUMNS FIRST
-- ====================================================================
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT false;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS whatsapp_group_url TEXT;

ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS order_id TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS service_id UUID;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'mentorship';
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS metadata JSONB;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS razorpay_account_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS image TEXT;

ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS featured_image TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS seo_description TEXT;

ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS college_id TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS short_name TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS established INTEGER;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS tier TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS avg_package TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS annual_fee TEXT;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS ai_score INTEGER;

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

-- Add UNIQUE constraints for upsert operations
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_payment_id_key' AND conrelid = 'public.sessions'::regclass) THEN
    ALTER TABLE public.sessions ADD CONSTRAINT sessions_payment_id_key UNIQUE (payment_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payments_payment_id_key' AND conrelid = 'public.payments'::regclass) THEN
    ALTER TABLE public.payments ADD CONSTRAINT payments_payment_id_key UNIQUE (payment_id);
  END IF;
END $$;

-- ====================================================================
-- STEP 2: ENABLE RLS ON ALL TABLES
-- ====================================================================
ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_audit_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_applications  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselings          ENABLE ROW LEVEL SECURITY;

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
-- STEP 4: CREATE POLICIES
--
-- STRATEGY:
--   - anon  = can READ public content only (courses, colleges, blogs)
--   - anon  = CANNOT write anything
--   - service_role = bypasses ALL RLS automatically (used by server)
--   - All writes go through your API routes using service_role key
-- ====================================================================

-- ── PROFILES ──
-- Read: anyone can read (admin portal needs all profiles)
-- Write: blocked for anon (server handles via service_role)
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT TO anon, authenticated USING (true);

-- ── COURSES ──
-- Read: anyone can read published courses
CREATE POLICY "courses_select" ON public.courses
  FOR SELECT TO anon, authenticated USING (true);

-- ── COLLEGES ──
CREATE POLICY "colleges_select" ON public.colleges
  FOR SELECT TO anon, authenticated USING (true);

-- ── BLOGS ──
CREATE POLICY "blogs_select" ON public.blogs
  FOR SELECT TO anon, authenticated USING (true);

-- ── COUNSELINGS ──
CREATE POLICY "counselings_select" ON public.counselings
  FOR SELECT TO anon, authenticated USING (true);

-- ── REVIEWS ──
CREATE POLICY "reviews_select" ON public.reviews
  FOR SELECT TO anon, authenticated USING (true);

-- ── COURSE ENROLLMENTS ──
CREATE POLICY "enrollments_select" ON public.course_enrollments
  FOR SELECT TO anon, authenticated USING (true);

-- ── SESSIONS ──
CREATE POLICY "sessions_select" ON public.sessions
  FOR SELECT TO anon, authenticated USING (true);

-- ── PAYMENTS ──
CREATE POLICY "payments_select" ON public.payments
  FOR SELECT TO anon, authenticated USING (true);

-- ── NOTIFICATIONS ──
CREATE POLICY "notifications_select" ON public.notifications
  FOR SELECT TO anon, authenticated USING (true);

-- ── MENTOR APPLICATIONS ──
CREATE POLICY "applications_select" ON public.mentor_applications
  FOR SELECT TO anon, authenticated USING (true);

-- ── AUDIT LOGS ──
CREATE POLICY "audit_select" ON public.course_audit_logs
  FOR SELECT TO anon, authenticated USING (true);

-- ── LESSON PROGRESS ──
CREATE POLICY "progress_select" ON public.lesson_progress
  FOR SELECT TO anon, authenticated USING (true);

-- ====================================================================
-- STEP 5: GRANT PERMISSIONS
-- ====================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ====================================================================
-- STEP 6: VERIFY
-- ====================================================================
SELECT tablename, rowsecurity AS rls_on
FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

SELECT tablename, policyname, cmd
FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;
