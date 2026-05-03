-- SUPABASE SCHEMA FOR APNA COUNSELLOR
-- Run this in the Supabase SQL Editor

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (linked to auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    image TEXT,
    role TEXT CHECK (role IN ('student', 'mentor', 'admin')) DEFAULT 'student',
    phone TEXT,
    bio TEXT,
    blocked BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    onboarding_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Student Profile Fields
    academic_class TEXT,
    exam TEXT,
    marks TEXT,
    rank TEXT,
    category TEXT,
    interested_states TEXT[],
    interests JSONB,
    budget TEXT,
    preferred_location TEXT,
    city TEXT,
    target_year INTEGER,
    
    -- Mentor Profile Fields
    college TEXT,
    course TEXT,
    branch TEXT,
    year TEXT,
    linkedin TEXT,
    approved BOOLEAN DEFAULT FALSE,
    skills JSONB,
    pricing NUMERIC,
    rating NUMERIC DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    sessions_count INTEGER DEFAULT 0,
    earnings NUMERIC DEFAULT 0,
    headline TEXT,
    about TEXT
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Counselings Table
CREATE TABLE public.counselings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT, -- Engineering / Medical
    region TEXT,   -- India / Abroad
    exam TEXT,
    official_url TEXT,
    description TEXT,
    links JSONB, -- Array of {label, url}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Colleges Table
CREATE TABLE public.colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id TEXT UNIQUE,
    counseling_id UUID REFERENCES public.counselings(id) ON DELETE SET NULL,
    aishe_code TEXT,
    name TEXT NOT NULL,
    short_name TEXT,
    state TEXT,
    city TEXT,
    location TEXT,
    type TEXT,
    nirf_rank INTEGER,
    ai_score NUMERIC,
    tier TEXT,
    established INTEGER,
    annual_fee TEXT,
    avg_package TEXT,
    website TEXT,
    branches JSONB,
    cutoffs JSONB,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Ranks Table
CREATE TABLE public.ranks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    course_name TEXT,
    category TEXT, -- General, OBC, etc.
    year INTEGER,
    opening_rank INTEGER,
    closing_rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Sessions Table
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    student_name TEXT,
    mentor_name TEXT,
    date DATE,
    time_slot TEXT,
    topic TEXT,
    status TEXT DEFAULT 'pending', -- pending, confirmed, completed, cancelled
    price NUMERIC,
    description TEXT,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Payments Table
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id TEXT UNIQUE, -- Razorpay Payment ID
    order_id TEXT,
    signature TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
    type TEXT, -- subscription, mentorship, course
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Subscriptions Table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id TEXT, -- pro, elite, basic
    status TEXT, -- active, expired, cancelled
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    razorpay_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Reviews Table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewer_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Notifications Table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT,
    message TEXT,
    type TEXT, -- info, warning, success
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Chat History
CREATE TABLE public.chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT, -- Can be UUID or string depending on implementation
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    role TEXT, -- user, assistant
    content TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --- RLS POLICIES ---

-- Profiles: Users can view all, but only update their own
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Trigger for creating profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, image)
    VALUES (
        new.id, 
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), 
        new.email, 
        COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
