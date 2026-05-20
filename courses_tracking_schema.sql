-- ====================================================================
--            COURSES & ENROLLMENT TRACKING SCHEMAS
-- ====================================================================
-- Run this in your Supabase SQL Editor to initialize Course publishing,
-- Student enrollment recording, and Activity tracking logs!

-- 1. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category TEXT DEFAULT 'Counselling',
    level TEXT DEFAULT 'beginner',
    duration_hours DECIMAL(5, 2) DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    curriculum JSONB DEFAULT '[]'::jsonb,
    slug TEXT UNIQUE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Course Enrollments Table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    payment_id TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'refunded', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, student_id)
);

-- 3. Course Audit/Activity Logs Table
CREATE TABLE IF NOT EXISTS public.course_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL, -- 'course_launched', 'student_enrolled', 'course_updated'
    details TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Disable RLS for seamless operations (or set up permissive RLS)
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_audit_logs DISABLE ROW LEVEL SECURITY;

-- 5. Trigger to automatically log student enrollment
CREATE OR REPLACE FUNCTION public.log_student_enrollment()
RETURNS TRIGGER AS $$
DECLARE
    course_title TEXT;
    student_email TEXT;
BEGIN
    SELECT title INTO course_title FROM public.courses WHERE id = NEW.course_id;
    SELECT email INTO student_email FROM public.profiles WHERE id = NEW.student_id;
    
    INSERT INTO public.course_audit_logs (action, details)
    VALUES ('student_enrolled', 'Student (' || COALESCE(student_email, NEW.student_id::text) || ') successfully enrolled in Course: ' || COALESCE(course_title, NEW.course_id::text));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_student_enrolled ON public.course_enrollments;
CREATE TRIGGER on_student_enrolled
    AFTER INSERT ON public.course_enrollments
    FOR EACH ROW EXECUTE PROCEDURE public.log_student_enrollment();
