-- Run this entire block in your Supabase SQL Editor

-- 1. Updates for the Notifications table to support targeting specific courses
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS target_group TEXT DEFAULT 'all';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE;

-- 2. Updates for the Course Enrollments table to track payments and exact time
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL;
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE public.course_enrollments ADD COLUMN IF NOT EXISTS amount NUMERIC;

-- 3. Create the Course Queries table for students asking mentors questions
CREATE TABLE IF NOT EXISTS public.course_queries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- 4. Ensure Realtime is enabled for course queries so admins see them
alter publication supabase_realtime add table public.course_queries;

