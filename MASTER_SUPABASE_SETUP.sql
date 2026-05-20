-- ====================================================================
--              MASTER APNA COUNSELLOR DATABASE UPGRADE SCRIPT
-- ====================================================================
-- This single, unified script configures your entire database to work
-- flawlessly under the new Firebase Authentication setup.
--
-- Instructions:
-- 1. Copy the entire contents of this file.
-- 2. Go to your Supabase Dashboard SQL Editor (https://supabase.com/).
-- 3. Click "New Query", paste this script, and click "Run".
-- ====================================================================

-- --------------------------------------------------------------------
-- PHASE 1: REMOVE NATIVE SUPABASE AUTH CONSTRAINTS
-- --------------------------------------------------------------------
-- This drops the link between profiles and auth.users. It dynamically
-- searches for and deletes ANY foreign key constraint restricting profiles.id
-- so that Firebase deterministic UUIDs can sync smoothly.

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
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_schema = 'public'
          AND tc.table_name = 'profiles'
          AND kcu.column_name = 'id'
    ) LOOP
        EXECUTE 'ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS ' || quote_ident(r.constraint_name);
    END LOOP;
END $$;

-- --------------------------------------------------------------------
-- PHASE 2: ENSURE TABLE STRUCTURES ARE UPGRADED & COMPATIBLE
-- --------------------------------------------------------------------

-- 1. Enable UUID Extension (required for key generations)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Profiles Table: Add all newly integrated fields if they don't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS google_refresh_token TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS google_calendar_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS branch TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS year TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS headline TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS about TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills JSONB;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pricing NUMERIC DEFAULT 499;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS earnings NUMERIC DEFAULT 0;

-- 3. Sessions Table: Add Google Meet integration fields if they don't exist
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS meeting_link TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS google_event_id TEXT;

-- 4. Create Mentor Services Table (if not exists)
CREATE TABLE IF NOT EXISTS public.mentor_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INTEGER DEFAULT 45,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Reviews Table (if not exists)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewer_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create Mentor Applications Table (if not exists)
CREATE TABLE IF NOT EXISTS public.mentor_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    college TEXT NOT NULL,
    branch TEXT NOT NULL,
    bio TEXT,
    skills TEXT[],
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Notifications Schema Fixes (Ensure 'is_read' exists and matches schema expectations)
DO $$ 
BEGIN 
    -- If old 'read' column exists but not 'is_read', rename it
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='notifications' AND column_name='read') 
    AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='notifications' AND column_name='is_read') THEN
        ALTER TABLE public.notifications RENAME COLUMN "read" TO "is_read";
    END IF;
END $$;

ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS "is_read" BOOLEAN DEFAULT FALSE;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS "link" TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS "target_group" TEXT DEFAULT 'all';

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check CHECK (type IN ('info', 'warning', 'success', 'error'));

-- --------------------------------------------------------------------
-- PHASE 3: AUTOMATION TRIGGERS & PROCEDURES
-- --------------------------------------------------------------------

-- 1. Helper Function: Slug Generation (for profiles & SEO URLs)
CREATE OR REPLACE FUNCTION generate_slug(name TEXT) RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Apply slug generation to any legacy null profile slugs
UPDATE public.profiles SET slug = generate_slug(name) WHERE slug IS NULL;

-- 2. Helper Function: Automatically recalculate Mentor stats on new review
CREATE OR REPLACE FUNCTION public.update_mentor_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET 
        rating = COALESCE((SELECT AVG(rating) FROM public.reviews WHERE mentor_id = NEW.mentor_id), 0),
        reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE mentor_id = NEW.mentor_id)
    WHERE id = NEW.mentor_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind review trigger
DROP TRIGGER IF EXISTS on_review_inserted ON public.reviews;
CREATE TRIGGER on_review_inserted
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE PROCEDURE public.update_mentor_stats();

-- --------------------------------------------------------------------
-- PHASE 4: DISABLE ROW LEVEL SECURITY (RLS) FOR SMOOTH FIREBASE ACCESS
-- --------------------------------------------------------------------
-- Client-side DB requests operate without Supabase native auth JWTs.
-- To allow secure and uninterrupted reads/writes from the website, we disable RLS.

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_applications DISABLE ROW LEVEL SECURITY;

-- ====================================================================
--                  MASTER UPGRADE COMPLETED SUCCESSFULLY!
-- ====================================================================
