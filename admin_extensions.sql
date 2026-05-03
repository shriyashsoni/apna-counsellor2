-- ADMIN COMMAND CENTER EXTENSIONS
-- Run this in Supabase SQL Editor

-- 1. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
    link TEXT,
    target_group TEXT DEFAULT 'all', -- 'all', 'mentors', 'students'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MENTOR APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.mentor_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    name TEXT NOT NULL,
    college TEXT NOT NULL,
    branch TEXT NOT NULL,
    bio TEXT,
    skills TEXT[],
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ENABLE RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_applications ENABLE ROW LEVEL SECURITY;

-- 4. SUPER ADMIN POLICIES
CREATE POLICY "Super-Admin All Notifications" ON public.notifications FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super-Admin All Applications" ON public.mentor_applications FOR ALL USING (public.is_super_admin());

-- 5. PUBLIC/USER READ POLICIES
CREATE POLICY "Users Read Own Notifications" ON public.notifications FOR SELECT USING (target_group = 'all');
CREATE POLICY "Users Create Own Applications" ON public.mentor_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
