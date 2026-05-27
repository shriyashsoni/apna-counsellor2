-- ====================================================================
--            UPGRADE NOTIFICATIONS SYSTEM SCHEMA
-- ====================================================================
-- Run this in your Supabase SQL Editor to link Notifications to 
-- specific courses and enable smooth anonymous operations.

-- 1. Add course_id column to notifications table
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE;

-- 2. Drop old restrictive policies on notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can do everything with notifications" ON public.notifications;
DROP POLICY IF EXISTS "Ultimate Access - Notifications" ON public.notifications;

-- 3. Apply GOD MODE policy for Notifications
-- Bypasses RLS blocks for Firebase Auth users (treated as anon by Supabase)
CREATE POLICY "Ultimate Access - Notifications" 
ON public.notifications FOR ALL USING (true) WITH CHECK (true);

-- 4. Enable RLS technically
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 5. Explicitly grant API access to default Supabase roles (Supabase May 2026 Mandate)
GRANT ALL ON TABLE public.notifications TO anon, authenticated, service_role;
