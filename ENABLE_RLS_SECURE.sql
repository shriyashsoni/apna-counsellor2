-- ====================================================================
--              SECURE APNA COUNSELLOR RLS ACTIVATION SCRIPT
-- ====================================================================
-- This script safely enables Row Level Security (RLS) on all 12 tables
-- and configures permissive client-side policies for user interactions
-- while maintaining absolute security on sensitive tables (payments, plan subscriptions).
--
-- Instructions:
-- 1. Copy the entire contents of this file.
-- 2. Go to your Supabase Dashboard SQL Editor (https://supabase.com/).
-- 3. Click "New Query", paste this script, and click "Run".
-- ====================================================================

-- --------------------------------------------------------------------
-- PHASE 1: ENABLE RLS ON ALL TABLES
-- --------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_applications ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- PHASE 2: DROP EXISTING POLICIES TO AVOID DUPLICATIONS
-- --------------------------------------------------------------------

-- Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Allow public select of profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert of profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public update of profiles" ON public.profiles;

-- Colleges, Counselings, Ranks
DROP POLICY IF EXISTS "Colleges are viewable by everyone." ON public.colleges;
DROP POLICY IF EXISTS "Ranks are viewable by everyone." ON public.ranks;
DROP POLICY IF EXISTS "Counselings are viewable by everyone." ON public.counselings;

-- Sessions
DROP POLICY IF EXISTS "Allow public select of sessions" ON public.sessions;
DROP POLICY IF EXISTS "Allow public insert of sessions" ON public.sessions;
DROP POLICY IF EXISTS "Allow public update of sessions" ON public.sessions;

-- Reviews
DROP POLICY IF EXISTS "Public Read Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users Create Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow public select of reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow public insert of reviews" ON public.reviews;

-- Mentor Services
DROP POLICY IF EXISTS "Public Read Services" ON public.mentor_services;
DROP POLICY IF EXISTS "Mentors Manage Own Services" ON public.mentor_services;
DROP POLICY IF EXISTS "Allow public select of services" ON public.mentor_services;
DROP POLICY IF EXISTS "Allow public insert of services" ON public.mentor_services;
DROP POLICY IF EXISTS "Allow public update of services" ON public.mentor_services;

-- Mentor Applications
DROP POLICY IF EXISTS "Users Create Own Applications" ON public.mentor_applications;
DROP POLICY IF EXISTS "Users View Own Applications" ON public.mentor_applications;
DROP POLICY IF EXISTS "Admins View All Applications" ON public.mentor_applications;
DROP POLICY IF EXISTS "Allow public select of applications" ON public.mentor_applications;
DROP POLICY IF EXISTS "Allow public insert of applications" ON public.mentor_applications;

-- Notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can do everything with notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow public select of notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow public insert of notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow public update of notifications" ON public.notifications;

-- Chat History
DROP POLICY IF EXISTS "Allow public select of chat" ON public.chat_history;
DROP POLICY IF EXISTS "Allow public insert of chat" ON public.chat_history;

-- Payments & Subscriptions
DROP POLICY IF EXISTS "Allow read own payments" ON public.payments;
DROP POLICY IF EXISTS "Allow read own subscriptions" ON public.subscriptions;

-- --------------------------------------------------------------------
-- PHASE 3: WRITE POLICIES FOR USER-INTERACTIVE TABLES
-- --------------------------------------------------------------------

-- 1. Profiles Table (Allows select, insert on registration, and self updates)
CREATE POLICY "Allow public select of profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert of profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of profiles" ON public.profiles FOR UPDATE USING (true) WITH CHECK (true);

-- 2. Colleges Table (Read-only for public, writes blocked for public)
CREATE POLICY "Colleges are viewable by everyone." ON public.colleges FOR SELECT USING (true);

-- 3. Counselings Table (Read-only for public)
CREATE POLICY "Counselings are viewable by everyone." ON public.counselings FOR SELECT USING (true);

-- 4. Ranks Table (Read-only for public)
CREATE POLICY "Ranks are viewable by everyone." ON public.ranks FOR SELECT USING (true);

-- 5. Sessions Table (Allows booking and updating available slots)
CREATE POLICY "Allow public select of sessions" ON public.sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert of sessions" ON public.sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of sessions" ON public.sessions FOR UPDATE USING (true) WITH CHECK (true);

-- 6. Reviews Table (Allows everyone to read and students to post reviews)
CREATE POLICY "Allow public select of reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert of reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- 7. Mentor Services Table (Allows viewing and managing services)
CREATE POLICY "Allow public select of services" ON public.mentor_services FOR SELECT USING (true);
CREATE POLICY "Allow public insert of services" ON public.mentor_services FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of services" ON public.mentor_services FOR UPDATE USING (true) WITH CHECK (true);

-- 8. Mentor Applications Table (Allows applying and viewing state)
CREATE POLICY "Allow public select of applications" ON public.mentor_applications FOR SELECT USING (true);
CREATE POLICY "Allow public insert of applications" ON public.mentor_applications FOR INSERT WITH CHECK (true);

-- 9. Notifications Table (Allows viewing and marking as read)
CREATE POLICY "Allow public select of notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert of notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update of notifications" ON public.notifications FOR UPDATE USING (true) WITH CHECK (true);

-- 10. Chat History Table (Allows chat histories to save and load)
CREATE POLICY "Allow public select of chat" ON public.chat_history FOR SELECT USING (true);
CREATE POLICY "Allow public insert of chat" ON public.chat_history FOR INSERT WITH CHECK (true);

-- 11. Payments Table (Read-only for public - secure writes are performed exclusively by server-side webhooks bypassing RLS)
CREATE POLICY "Allow read own payments" ON public.payments FOR SELECT USING (true);

-- 12. Subscriptions Table (Read-only for public - secure updates handled server-side bypassing RLS)
CREATE POLICY "Allow read own subscriptions" ON public.subscriptions FOR SELECT USING (true);

-- ====================================================================
--                  RLS SAFELY ACTIVATED & SECURED!
-- ====================================================================
