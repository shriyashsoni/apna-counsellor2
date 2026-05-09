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

-- 4. Automatically update mentor rating and reviews_count
CREATE OR REPLACE FUNCTION public.update_mentor_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.profiles
    SET 
        rating = (SELECT AVG(rating) FROM public.reviews WHERE mentor_id = NEW.mentor_id),
        reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE mentor_id = NEW.mentor_id)
    WHERE id = NEW.mentor_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_inserted ON public.reviews;
CREATE TRIGGER on_review_inserted
    AFTER INSERT ON public.reviews
    FOR EACH ROW EXECUTE PROCEDURE public.update_mentor_stats();

-- 5. Create Mentor Applications Table
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

-- Enable RLS
ALTER TABLE public.mentor_applications ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users Create Own Applications" ON public.mentor_applications;
CREATE POLICY "Users Create Own Applications" ON public.mentor_applications 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users View Own Applications" ON public.mentor_applications;
CREATE POLICY "Users View Own Applications" ON public.mentor_applications 
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins View All Applications" ON public.mentor_applications;
CREATE POLICY "Admins View All Applications" ON public.mentor_applications 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
