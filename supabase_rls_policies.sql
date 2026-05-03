-- 1. ENABLE RLS FOR ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- 2. PROFILES POLICIES
-- Everyone can view profiles (to see mentor info)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 3. COUNSELINGS POLICIES (Public Read-Only)
CREATE POLICY "Counselings are viewable by everyone" ON public.counselings
    FOR SELECT USING (true);

-- 4. COLLEGES POLICIES (Public Read-Only)
CREATE POLICY "Colleges are viewable by everyone" ON public.colleges
    FOR SELECT USING (true);

-- 5. RANKS POLICIES (Public Read-Only)
CREATE POLICY "Ranks are viewable by everyone" ON public.ranks
    FOR SELECT USING (true);

-- 6. SESSIONS POLICIES
-- Users can see sessions they are involved in
CREATE POLICY "Users can view their own sessions" ON public.sessions
    FOR SELECT USING (auth.uid() = student_id OR auth.uid() = mentor_id);

-- Students can insert sessions (bookings)
CREATE POLICY "Students can create sessions" ON public.sessions
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- 7. PAYMENTS POLICIES
-- Users can see their own payments
CREATE POLICY "Users can view their own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

-- 8. SUBSCRIPTIONS POLICIES
-- Users can see their own subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- 9. REVIEWS POLICIES
-- Everyone can see reviews
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
    FOR SELECT USING (true);

-- Users can only review if they are the reviewer
CREATE POLICY "Users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- 10. NOTIFICATIONS POLICIES
-- Users can see their own notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Users can mark their own notifications as read
CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- 11. CHAT HISTORY POLICIES
-- Users can see their own chat history
CREATE POLICY "Users can view their own chat history" ON public.chat_history
    FOR SELECT USING (auth.uid() = user_id);
