-- PLACEMENT STATISTICS SCHEMA
-- RUN THIS IN SUPABASE SQL EDITOR

CREATE TABLE IF NOT EXISTS public.placement_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    total_offers INTEGER,
    highest_package DECIMAL(12, 2),
    average_package DECIMAL(12, 2),
    median_package DECIMAL(12, 2),
    placement_percentage DECIMAL(5, 2),
    top_recruiters TEXT[], -- Array of company names
    branch_stats JSONB, -- Array of {branch: string, avg: number, median: number, max: number}
    report_url TEXT, -- PDF Link
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(college_id, year)
);

-- RLS for Placements
ALTER TABLE public.placement_reports ENABLE ROW LEVEL SECURITY;

-- Drop old if exists
DROP POLICY IF EXISTS "Super-Admin Full Access Placements" ON public.placement_reports;
CREATE POLICY "Super-Admin Full Access Placements" ON public.placement_reports 
    FOR ALL USING (public.is_super_admin());

CREATE POLICY "Public Read Placements" ON public.placement_reports 
    FOR SELECT USING (is_published = true);
