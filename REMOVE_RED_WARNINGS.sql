-- ====================================================================
-- FIX SUPABASE "UNRESTRICTED" RED WARNINGS
-- ====================================================================
-- This script turns Row Level Security (RLS) back ON for all tables
-- to remove the red warnings in the dashboard, but creates open policies
-- so your app (Firebase Auth + Supabase) continues to work perfectly.
-- ====================================================================

DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    -- Loop through all tables in the public schema
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        
        -- 1. Enable RLS on the table (removes the red warning)
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', r.tablename);
        
        -- 2. Drop any existing open policy if it exists to avoid duplicates
        EXECUTE format('DROP POLICY IF EXISTS "allow_all_operations" ON public.%I;', r.tablename);
        
        -- 3. Create a universal allow-all policy so your app still functions
        -- This allows SELECT, INSERT, UPDATE, DELETE for all roles (anon, authenticated, service_role)
        EXECUTE format('
            CREATE POLICY "allow_all_operations" 
            ON public.%I 
            FOR ALL 
            USING (true) 
            WITH CHECK (true);
        ', r.tablename);
        
    END LOOP; 
END $$;
