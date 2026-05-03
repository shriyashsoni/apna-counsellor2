-- DEPTH SCHEMA FOR COURSES, BLOGS & TEST SERIES
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. COURSES (Advanced)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    long_description TEXT, -- Rich HTML or Markdown
    price DECIMAL(10, 2) DEFAULT 0,
    sale_price DECIMAL(10, 2),
    image_url TEXT,
    video_preview_url TEXT,
    category TEXT,
    level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    duration_hours INTEGER,
    total_lessons INTEGER,
    benefits TEXT[], -- Array of "What you will learn"
    requirements TEXT[],
    curriculum JSONB, -- Array of modules: {title: string, lessons: {title: string, duration: string, type: 'video'|'pdf'}}
    is_published BOOLEAN DEFAULT FALSE,
    instructor_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. BLOGS (Advanced)
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    content TEXT, -- Rich content
    excerpt TEXT,
    featured_image TEXT,
    category TEXT,
    tags TEXT[],
    seo_title TEXT,
    seo_description TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    author_id UUID REFERENCES public.profiles(id),
    read_time_minutes INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TEST SERIES (Advanced)
CREATE TABLE IF NOT EXISTS public.test_series (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    category TEXT, -- e.g. MHT CET, JEE, NEET
    image_url TEXT,
    price DECIMAL(10, 2) DEFAULT 0,
    features TEXT[], -- e.g. "Detailed Solutions", "All India Rank"
    total_tests INTEGER,
    template_type TEXT DEFAULT 'standard', -- Different UI templates for students
    test_list JSONB, -- Array of {name: string, duration: number, marks: number, link: string}
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RE-APPLY POLICIES (Full Power to Owners)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_series ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND email IN ('sonishriyash@gmail.com', 'apnacounsellor@gmail.com')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate policies
DO $$ 
DECLARE r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('blogs', 'courses', 'test_series')) LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.' || quote_ident(r.tablename);
    END LOOP;
END $$;

CREATE POLICY "Super-Admin All Courses" ON public.courses FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super-Admin All Blogs" ON public.blogs FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super-Admin All Test Series" ON public.test_series FOR ALL USING (public.is_super_admin());

CREATE POLICY "Public Read Courses" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Blogs" ON public.blogs FOR SELECT USING (is_published = true);
CREATE POLICY "Public Read Test Series" ON public.test_series FOR SELECT USING (is_published = true);
