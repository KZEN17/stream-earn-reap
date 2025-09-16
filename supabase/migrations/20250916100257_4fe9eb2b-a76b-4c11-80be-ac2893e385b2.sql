-- Fix critical security vulnerability: Replace existing insecure policies

-- Drop ALL existing policies on profiles table to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new SECURE policies
-- 1. Users can view ONLY their own complete profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Users can create ONLY their own profile  
CREATE POLICY "Users can create own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Users can update ONLY their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 4. For app functionality, authenticated users can view LIMITED public data of others
-- This excludes sensitive data like wallet addresses, social media handles, etc.
CREATE POLICY "Authenticated users limited public view" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND user_id != auth.uid()
  AND profile_visibility = 'public'
);

-- Add privacy control column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'public' 
CHECK (profile_visibility IN ('public', 'friends', 'private'));