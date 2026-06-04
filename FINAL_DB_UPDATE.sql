-- Comprehensive Database Update Script for Apna Counsellor
-- Run this in your Supabase SQL Editor. It is safe to run multiple times (idempotent).

-- ==========================================
-- 1. COURSES TABLE UPDATES
-- ==========================================
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

-- ==========================================
-- 2. NOTIFICATIONS TABLE (For Native In-App Bell)
-- ==========================================
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

-- Safely add columns if table existed but was missing them
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS link TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS is_broadcast BOOLEAN DEFAULT false;

-- Enable Realtime for notifications so the bell icon updates instantly
alter publication supabase_realtime add table public.notifications;

-- ==========================================
-- 3. COURSE ENROLLMENTS (For Batch Access)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    access_expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(course_id, student_id)
);

-- ==========================================
-- 4. COURSE AUDIT LOGS (For Admin Tracking)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.course_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- 5. REFRESH SCHEMA CACHE
-- Note: Supabase automatically detects most schema changes. If you need to manually refresh the API cache,
-- you can click "Reload API Cache" in the Supabase Dashboard under Settings -> API.
