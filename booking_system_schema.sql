-- BOOKING SYSTEM TABLES
-- Run this in Supabase SQL Editor

-- Table: bookings
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    duration_minutes INTEGER NOT NULL,
    service_price DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    payment_id TEXT, -- Razorpay Payment ID
    meeting_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: payments_detailed (to distinguish from existing payments if needed, or just extend existing)
-- Extending existing payments table if it exists, otherwise create
-- The existing schema had: id, payment_id, order_id, signature, amount, currency, status, user_id, mentor_id, session_id, type, created_at
-- Let's stick to the brief's structure but keep it compatible

CREATE TABLE IF NOT EXISTS public.booking_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_method TEXT, -- upi, card, netbanking
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: mentor_availability
CREATE TABLE IF NOT EXISTS public.mentor_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    day_of_week TEXT CHECK (day_of_week IN ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: call_details
CREATE TABLE IF NOT EXISTS public.call_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    meeting_link TEXT,
    call_started_at TIMESTAMP WITH TIME ZONE,
    call_ended_at TIMESTAMP WITH TIME ZONE,
    duration_actual INTEGER, -- in seconds
    recording_link TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_details ENABLE ROW LEVEL SECURITY;

-- Profiles Policy: Students can see their own bookings, mentors can see theirs
CREATE POLICY "Students can view own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Mentors can view own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = mentor_id);

-- Availability is public for selection
CREATE POLICY "Public can view mentor availability" ON public.mentor_availability
    FOR SELECT USING (true);
