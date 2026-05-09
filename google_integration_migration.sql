-- MIGRATION FOR GOOGLE INTEGRATION & REVIEWS
-- Run this in the Supabase SQL Editor

-- 1. Update Profiles Table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS google_refresh_token TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS google_calendar_id TEXT;

-- 2. Update Sessions Table
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS meeting_link TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS google_event_id TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available'; -- Ensure status is available

-- 3. Update status constraint for sessions if needed
-- ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_status_check;
-- ALTER TABLE public.sessions ADD CONSTRAINT sessions_status_check CHECK (status IN ('available', 'pending', 'confirmed', 'completed', 'cancelled'));

-- 4. Ensure earnings tracking is possible
-- (Already handled in code by filtering sessions)
