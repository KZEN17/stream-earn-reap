-- Add OAuth tokens and verification status to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS instagram_access_token TEXT,
ADD COLUMN IF NOT EXISTS instagram_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS instagram_user_id TEXT,
ADD COLUMN IF NOT EXISTS tiktok_access_token TEXT,
ADD COLUMN IF NOT EXISTS tiktok_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tiktok_user_id TEXT,
ADD COLUMN IF NOT EXISTS youtube_access_token TEXT,
ADD COLUMN IF NOT EXISTS youtube_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS youtube_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS twitter_access_token TEXT,
ADD COLUMN IF NOT EXISTS twitter_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS twitter_user_id TEXT;

-- Create table to store campaign requirements
CREATE TABLE IF NOT EXISTS public.campaign_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'twitter')),
  required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(campaign_id, platform)
);

-- Enable RLS on campaign_requirements
ALTER TABLE public.campaign_requirements ENABLE ROW LEVEL SECURITY;

-- Create policies for campaign_requirements
CREATE POLICY "Users can view campaign requirements for active campaigns"
ON public.campaign_requirements
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.campaigns 
    WHERE campaigns.id = campaign_requirements.campaign_id 
    AND campaigns.status = 'active'
  )
);

CREATE POLICY "Campaign creators can manage their requirements"
ON public.campaign_requirements
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.campaigns 
    WHERE campaigns.id = campaign_requirements.campaign_id 
    AND campaigns.creator_id = auth.uid()
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_campaign_requirements_updated_at
BEFORE UPDATE ON public.campaign_requirements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();