-- FINAL ADMIN DASHBOARD & PERMISSIONS SCHEMA
-- Run this in Supabase SQL Editor

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CORE TABLES (Ensuring they exist or updating them)

-- Profiles Role Constraint (if not already present)
DO $$ BEGIN
    ALTER TABLE public.profiles ADD CONSTRAINT role_check CHECK (role IN ('student', 'mentor', 'admin'));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. ADMIN CONTENT TABLES

CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    instructor_id UUID REFERENCES public.profiles(id),
    curriculum JSONB,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.test_series (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    total_tests INTEGER,
    subjects TEXT[],
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT CHECK (type IN ('issue', 'request', 'feedback')),
    user_id UUID REFERENCES public.profiles(id),
    title TEXT,
    description TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority TEXT DEFAULT 'low' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. STRICT PERMISSIONS (RLS POLICIES)

-- Enable RLS on all admin tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- DROP OLD POLICIES IF THEY EXIST
DROP POLICY IF EXISTS "Admins have full access to courses" ON public.courses;
DROP POLICY IF EXISTS "Admins have full access to test_series" ON public.test_series;
DROP POLICY IF EXISTS "Admins have full access to system_logs" ON public.system_logs;
DROP POLICY IF EXISTS "Admins have full access to system_settings" ON public.system_settings;

-- DEFINE THE SUPER-ADMINS (ONLY THESE TWO EMAILS)
-- We use a function for cleaner policy management
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND email IN ('sonishriyash@gmail.com', 'apnacounsellor@gmail.com')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- APPLY STRICT POLICIES
CREATE POLICY "Super-Admin Full Access - Courses" ON public.courses
    FOR ALL USING (public.is_super_admin());

CREATE POLICY "Super-Admin Full Access - Test Series" ON public.test_series
    FOR ALL USING (public.is_super_admin());

CREATE POLICY "Super-Admin Full Access - Logs" ON public.system_logs
    FOR ALL USING (public.is_super_admin());

CREATE POLICY "Super-Admin Full Access - Settings" ON public.system_settings
    FOR ALL USING (public.is_super_admin());

-- Also ensure only super-admins can update roles in profiles
DROP POLICY IF EXISTS "Admins can update roles" ON public.profiles;
CREATE POLICY "Super-Admins can update roles" ON public.profiles
    FOR UPDATE USING (public.is_super_admin());

-- 5. INITIAL DATA
INSERT INTO public.system_settings (key, value) VALUES 
('storage_limits', '{"total_gb": 100, "used_gb": 12.5, "max_file_size_mb": 50}'),
('user_limits', '{"max_mentors": 500, "max_students": 10000, "active_sessions_limit": 100}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
