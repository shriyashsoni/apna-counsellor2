-- MENTOR VISIBILITY & ADMIN FIXES
-- Run this in Supabase SQL Editor

-- 1. Add is_visible to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT FALSE;

-- 2. Update mentor_applications policies to be more inclusive for admins
-- Some admins might not be "super_admins" by email but might have the 'admin' role
DROP POLICY IF EXISTS "Admins View All Applications" ON public.mentor_applications;
CREATE POLICY "Admins View All Applications" ON public.mentor_applications 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND (role = 'admin' OR public.is_super_admin())
        )
    );

-- 3. Ensure profiles are readable by admins
DROP POLICY IF EXISTS "Admins View All Profiles" ON public.profiles;
CREATE POLICY "Admins View All Profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND (role = 'admin' OR public.is_super_admin())
        )
    );

-- 4. Update existing mentors to be visible (optional, but helpful for migration)
UPDATE public.profiles SET is_visible = TRUE WHERE role = 'mentor';
