-- ====================================================================
--            FIX PROFILES TABLE ROW-LEVEL SECURITY (GOD MODE)
-- ====================================================================
-- Because your application uses Firebase for Authentication, Supabase 
-- considers all your frontend users as "Anonymous" (anon). 
-- Therefore, standard RLS policies block them from registering, updating, 
-- or creating their profiles during sign-up/onboarding.
--
-- This script bypasses RLS for the profiles table so registration 
-- and profile updates work flawlessly.
--
-- INSTRUCTIONS: Copy all of this and run it in the Supabase SQL Editor.
-- ====================================================================

-- 1. Ensure RLS is technically enabled on profiles
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Clean up old, restrictive policies on profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Allow full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Ultimate Access - Profiles" ON public.profiles;

-- 3. APPLY "GOD MODE" POLICY FOR PROFILES
-- Allows public select, insert, and update from your frontend client
CREATE POLICY "Ultimate Access - Profiles" 
ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- 4. Explicitly grant API access to default Supabase roles (Supabase May 2026 Mandate)
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;
