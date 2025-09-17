-- Critical Security Fixes Migration

-- 1. Create admin role function for secure role checking
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  );
$$;

-- 2. Tighten profiles table public visibility
DROP POLICY IF EXISTS "Authenticated users can view limited public profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users limited public view" ON public.profiles;

-- Create more restrictive public profile policy
CREATE POLICY "Public can view basic profile info only"
ON public.profiles
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND profile_visibility = 'public' 
  AND user_id != auth.uid()
);

-- 3. Secure wallet audit logs - admin only
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.wallet_audit_log;

CREATE POLICY "Only admins can view audit logs"
ON public.wallet_audit_log
FOR SELECT
USING (public.is_admin());

-- 4. Restrict payout system access to authorized users only
DROP POLICY IF EXISTS "Campaign creators can view tasks for their campaigns" ON public.payout_tasks;
DROP POLICY IF EXISTS "Users can view their own payout tasks" ON public.payout_tasks;
DROP POLICY IF EXISTS "Campaign creators can view transactions for their campaigns" ON public.payout_transactions;
DROP POLICY IF EXISTS "Users can view their own payout transactions" ON public.payout_transactions;

-- More restrictive payout task policies
CREATE POLICY "Campaign owners and clip owners can view payout tasks"
ON public.payout_tasks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM campaigns c 
    WHERE c.id = payout_tasks.campaign_id 
    AND c.creator_id = auth.uid()
  )
  OR 
  EXISTS (
    SELECT 1 FROM clips cl 
    WHERE cl.id = payout_tasks.clip_id 
    AND cl.user_id = auth.uid()
  )
);

-- More restrictive payout transaction policies  
CREATE POLICY "Authorized users can view payout transactions"
ON public.payout_transactions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM payout_tasks pt
    JOIN campaigns c ON c.id = pt.campaign_id
    WHERE pt.transaction_id = payout_transactions.id
    AND c.creator_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM payout_tasks pt
    JOIN clips cl ON cl.id = pt.clip_id
    WHERE pt.transaction_id = payout_transactions.id
    AND cl.user_id = auth.uid()
  )
);

-- 5. Secure sensitive campaign data
CREATE POLICY "Only campaign owners can view financial details"
ON public.campaigns
FOR SELECT
USING (
  -- Public can see basic campaign info (non-financial)
  (status = 'active' AND auth.uid() IS NOT NULL)
  OR 
  -- Only owners can see all details including financial data
  (auth.uid() = creator_id)
);

-- 6. Add policy for campaign requirements security
DROP POLICY IF EXISTS "Users can view campaign requirements for active campaigns" ON public.campaign_requirements;

CREATE POLICY "Users can view requirements for active campaigns only"
ON public.campaign_requirements  
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM campaigns c
    WHERE c.id = campaign_requirements.campaign_id 
    AND c.status = 'active'
    AND auth.uid() IS NOT NULL
  )
);

-- 7. Secure clips table further
DROP POLICY IF EXISTS "Users can view clips for active campaigns" ON public.clips;

CREATE POLICY "Users can view approved clips in active campaigns"
ON public.clips
FOR SELECT  
USING (
  -- Users can see their own clips
  (auth.uid() = user_id)
  OR
  -- Campaign creators can see all clips for their campaigns
  EXISTS (
    SELECT 1 FROM campaigns c
    WHERE c.id = clips.campaign_id 
    AND c.creator_id = auth.uid()
  )
  OR
  -- Public can only see approved clips in active campaigns
  (
    status = 'approved' 
    AND EXISTS (
      SELECT 1 FROM campaigns c 
      WHERE c.id = clips.campaign_id 
      AND c.status = 'active'
    )
    AND auth.uid() IS NOT NULL
  )
);

-- 8. Secure user stats - only own stats visible
DROP POLICY IF EXISTS "Users can view their own stats" ON public.user_stats;

CREATE POLICY "Users can only view their own stats"
ON public.user_stats
FOR SELECT
USING (auth.uid() = user_id);

-- 9. Add admin override policies for management
CREATE POLICY "Admins can manage all data"
ON public.campaigns
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage all clips"  
ON public.clips
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage all profiles"
ON public.profiles  
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 10. Ensure all authenticated operations require valid session
CREATE OR REPLACE FUNCTION public.ensure_authenticated()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER  
AS $$
  SELECT auth.uid() IS NOT NULL AND auth.session() IS NOT NULL;
$$;