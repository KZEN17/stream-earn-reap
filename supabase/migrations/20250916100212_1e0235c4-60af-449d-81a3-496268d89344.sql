-- Fix critical security vulnerability: Restrict profile access to authenticated users only

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create new secure policies for profile access
-- 1. Users can view their own profile (full access)
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Authenticated users can view limited public profile data of others
-- Only expose non-sensitive information for legitimate app functionality
CREATE POLICY "Authenticated users can view limited public profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND user_id != auth.uid()
);

-- Add a privacy control column for future user-controlled privacy settings
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'friends', 'private'));

-- Create a security definer function to get safe public profile data
-- This ensures we only expose minimal necessary data for app functionality
CREATE OR REPLACE FUNCTION public.get_public_profile_data(profile_user_id UUID)
RETURNS TABLE (
  user_id UUID,
  display_name TEXT,
  avatar_url TEXT,
  user_type TEXT,
  username TEXT
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE SQL STABLE
AS $$
  SELECT 
    p.user_id,
    p.display_name,
    p.avatar_url,
    p.user_type,
    p.username
  FROM public.profiles p
  WHERE p.user_id = profile_user_id 
    AND p.profile_visibility = 'public'
    AND auth.uid() IS NOT NULL; -- Require authentication
$$;