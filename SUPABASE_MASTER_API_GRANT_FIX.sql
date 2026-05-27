-- ====================================================================
--       SUPABASE MASTER DATA API ACCESS & GRANT FIX (MAY 2026 MANDATE)
-- ====================================================================
-- This master script completely satisfies the new Supabase Security policy.
-- It does two critical actions:
-- 1. Automatically loops through ALL existing tables in your 'public' schema
--    and grants full API access to default roles (anon, authenticated, service_role).
-- 2. Configures default permissions so that any NEW tables you create in the
--    future will automatically inherit these grants.
--
-- INSTRUCTIONS: Copy all of this and run it in the Supabase SQL Editor.
-- ====================================================================

-- 1. DYNAMICALLY GRANT ACCESS ON ALL EXISTING TABLES
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE 'GRANT ALL ON TABLE public.' || quote_ident(r.table_name) || ' TO anon, authenticated, service_role;';
    END LOOP;
END $$;

-- 2. AUTOMATICALLY GRANT ACCESS ON ALL FUTURE TABLES CREATED
-- Ensures that you never have to manually run GRANT statements for new tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL ON TABLES TO anon, authenticated, service_role;
