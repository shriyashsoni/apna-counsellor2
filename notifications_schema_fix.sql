-- CONSOLIDATED NOTIFICATIONS SCHEMA FIX
-- Run this in the Supabase SQL Editor to resolve "is_read" column errors

-- 1. Consolidate "read" and "is_read" columns
DO $$ 
BEGIN 
    -- If old "read" column exists but not "is_read", rename it
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='notifications' AND column_name='read') 
    AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='notifications' AND column_name='is_read') THEN
        ALTER TABLE public.notifications RENAME COLUMN "read" TO "is_read";
    END IF;
END $$;

-- 2. Ensure "is_read" column exists with correct default
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS "is_read" BOOLEAN DEFAULT FALSE;

-- 3. Ensure other modern columns exist
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS "link" TEXT,
ADD COLUMN IF NOT EXISTS "target_group" TEXT DEFAULT 'all'; -- 'all', 'mentors', 'students'

-- 4. Update constraints for "type" if necessary
ALTER TABLE public.notifications 
DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('info', 'warning', 'success', 'error'));

-- 5. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 6. Basic Policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id OR target_group = 'all' OR target_group = (SELECT role FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- 7. Admin Policy
DROP POLICY IF EXISTS "Admins can do everything with notifications" ON public.notifications;
CREATE POLICY "Admins can do everything with notifications" ON public.notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Refresh Schema Cache (Internal Supabase step - usually automatic but good to mention)
-- SELECT pg_notify('pgrst', 'reload schema');
