-- FINAL COMPREHENSIVE ADMIN SCHEMA
-- RUN THIS IN SUPABASE SQL EDITOR TO FIX PERMISSIONS AND TABLES

-- 1. TABLES

-- Blogs Table
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    content TEXT,
    excerpt TEXT,
    image_url TEXT,
    author_id UUID REFERENCES public.profiles(id),
    category TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure Courses & Test Series exist with proper fields
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) DEFAULT 0,
    image_url TEXT,
    instructor_id UUID REFERENCES public.profiles(id),
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.test_series (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Health Tables
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT,
    title TEXT,
    description TEXT,
    status TEXT DEFAULT 'open',
    priority TEXT DEFAULT 'low',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ROBUST ADMIN CHECK FUNCTION

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current authenticated user has one of the allowed emails
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email IN ('sonishriyash@gmail.com', 'apnacounsellor@gmail.com')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. ENABLE RLS & APPLY POLICIES

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- CLEAR OLD POLICIES
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' AND (tablename IN ('blogs', 'courses', 'test_series', 'colleges', 'profiles', 'system_logs'))) 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- ALL-POWERFUL POLICIES FOR SUPER-ADMINS
CREATE POLICY "Super-Admin Full Access Blogs" ON public.blogs FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super-Admin Full Access Courses" ON public.courses FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super-Admin Full Access Test Series" ON public.test_series FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super-Admin Full Access Colleges" ON public.colleges FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super-Admin Full Access Profiles" ON public.profiles FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super-Admin Full Access Logs" ON public.system_logs FOR ALL USING (public.is_super_admin());

-- PUBLIC READ PERMISSIONS (So users can see courses/blogs/colleges)
CREATE POLICY "Public Read Blogs" ON public.blogs FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Courses" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Colleges" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);

-- 4. PROFILE TRIGGER (Make sure profiles stay in sync)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, image, role)
    VALUES (
        new.id, 
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), 
        new.email, 
        COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
        CASE 
          WHEN new.email IN ('sonishriyash@gmail.com', 'apnacounsellor@gmail.com') THEN 'admin'
          ELSE 'student'
        END
    )
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
