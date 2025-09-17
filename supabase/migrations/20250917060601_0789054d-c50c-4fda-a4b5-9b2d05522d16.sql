-- Critical Security Fix: Enable RLS on all tables and add proper policies

-- Enable RLS on all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_audit_log ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see public profiles and their own data
CREATE POLICY "Users can view public profiles" ON public.profiles
    FOR SELECT USING (profile_visibility = 'public' OR auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Campaigns: Public campaigns visible to all, sensitive data only to creators
CREATE POLICY "Public campaigns visible to all" ON public.campaigns
    FOR SELECT USING (
        status = 'active' OR 
        auth.uid() = creator_id OR 
        auth.uid() IN (SELECT user_id FROM public.profiles WHERE user_type = 'admin')
    );

CREATE POLICY "Campaign creators can update their campaigns" ON public.campaigns
    FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Authenticated users can create campaigns" ON public.campaigns
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Clips: Users can see their own clips and approved public clips
CREATE POLICY "Users can view approved clips and their own" ON public.clips
    FOR SELECT USING (
        status = 'approved' OR 
        auth.uid() = user_id OR
        auth.uid() IN (
            SELECT creator_id FROM public.campaigns WHERE id = clips.campaign_id
        )
    );

CREATE POLICY "Users can submit their own clips" ON public.clips
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clips" ON public.clips
    FOR UPDATE USING (auth.uid() = user_id);

-- User Wallets: Only accessible by wallet owner
CREATE POLICY "Users can only access their own wallets" ON public.user_wallets
    FOR ALL USING (auth.uid() = user_id);

-- Notifications: Only accessible by notification recipient
CREATE POLICY "Users can only see their own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- User Stats: Users can see their own stats, public stats visible to all
CREATE POLICY "Users can view their own stats" ON public.user_stats
    FOR SELECT USING (auth.uid() = user_id OR true); -- Allow public stats viewing

CREATE POLICY "Users can update their own stats" ON public.user_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- Payout Transactions: Only accessible by transaction owner
CREATE POLICY "Users can only see their own payouts" ON public.payout_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Wallet Audit Log: Only accessible by wallet owner
CREATE POLICY "Users can only see their own wallet audit logs" ON public.wallet_audit_log
    FOR SELECT USING (auth.uid() = user_id);

-- Create function to safely get public profile data
CREATE OR REPLACE FUNCTION public.get_public_profile_safe(profile_user_id uuid)
RETURNS TABLE(
    user_id uuid, 
    display_name text, 
    avatar_url text, 
    user_type text, 
    username text,
    total_earnings numeric,
    clips_count integer
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
    SELECT 
        p.user_id,
        p.display_name,
        p.avatar_url,
        p.user_type,
        p.username,
        COALESCE(us.total_earnings, 0) as total_earnings,
        COALESCE(us.clips_count, 0) as clips_count
    FROM public.profiles p
    LEFT JOIN public.user_stats us ON p.user_id = us.user_id
    WHERE p.user_id = profile_user_id 
        AND p.profile_visibility = 'public'
        AND auth.uid() IS NOT NULL;
$$;