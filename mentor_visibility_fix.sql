-- MENTOR VISIBILITY & ADMIN ULTIMATE FIX
-- Run this in Supabase SQL Editor to unlock your dashboard and fix mentor visibility

-- 1. ADD VISIBILITY COLUMN (If not exists)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT FALSE;

-- 2. FORCE ADMIN ROLE FOR OWNERS
-- Replace these with your actual admin emails if they are different
UPDATE public.profiles 
SET role = 'admin' 
WHERE email IN ('apnacounsellor@gmail.com', 'sonishriyash@gmail.com');

-- 3. RESET POLICIES (Clearing old conflicting rules)
DROP POLICY IF EXISTS "Public can view mentor profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins View All Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins View All Applications" ON public.mentor_applications;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public can see mentors" ON public.profiles;
DROP POLICY IF EXISTS "Admins see all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
DROP POLICY IF EXISTS "apps_admin_all" ON public.mentor_applications;
DROP POLICY IF EXISTS "Admins View All Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins View All Applications" ON public.mentor_applications;

-- 4. APPLY CLEAN ROBUST POLICIES
-- Everyone can see and update their own profile
CREATE POLICY "profiles_self_access" ON public.profiles FOR ALL USING (auth.uid() = id);

-- Public can see visible mentors
CREATE POLICY "profiles_public_mentor_view" ON public.profiles FOR SELECT 
USING (role = 'mentor' AND is_visible = true);

-- Admins can see and edit EVERYTHING (Email-based for maximum safety)
CREATE POLICY "profiles_admin_master" ON public.profiles FOR ALL 
USING (auth.jwt() ->> 'email' IN ('apnacounsellor@gmail.com', 'sonishriyash@gmail.com'));

-- Admins manage applications
CREATE POLICY "apps_admin_master" ON public.mentor_applications FOR ALL 
USING (auth.jwt() ->> 'email' IN ('apnacounsellor@gmail.com', 'sonishriyash@gmail.com'));

-- 5. MARK EXISTING MENTORS AS VISIBLE
UPDATE public.profiles SET is_visible = TRUE WHERE role = 'mentor';

-- 6. REVIEWS POLICIES
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "reviews_public_view" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_student_insert" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
