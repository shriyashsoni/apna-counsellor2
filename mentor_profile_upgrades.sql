-- 1. ADD SLUG TO PROFILES
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create function to generate slug from name
CREATE OR REPLACE FUNCTION generate_slug(name TEXT) RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Update existing slugs
UPDATE public.profiles SET slug = generate_slug(name) WHERE slug IS NULL;

-- 2. CREATE MENTOR SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.mentor_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INTEGER DEFAULT 45,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. REVIEWS TABLE (IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewer_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RLS POLICIES
ALTER TABLE public.mentor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Services Policies
CREATE POLICY "Public Read Services" ON public.mentor_services FOR SELECT USING (is_active = true);
CREATE POLICY "Mentors Manage Own Services" ON public.mentor_services FOR ALL USING (auth.uid() = mentor_id);

-- Reviews Policies
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (is_published = true);
CREATE POLICY "Users Create Reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
