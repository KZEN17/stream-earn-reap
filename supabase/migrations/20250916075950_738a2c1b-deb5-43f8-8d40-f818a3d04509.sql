-- Create profiles table with social media connections
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  -- Social media connections
  instagram_username TEXT,
  instagram_connected BOOLEAN DEFAULT FALSE,
  tiktok_username TEXT,
  tiktok_connected BOOLEAN DEFAULT FALSE,
  youtube_channel_id TEXT,
  youtube_connected BOOLEAN DEFAULT FALSE,
  -- User type
  user_type TEXT DEFAULT 'creator' CHECK (user_type IN ('creator', 'streamer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create streamers table for scheduling and launches
CREATE TABLE public.streamers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  twitch_username TEXT,
  youtube_channel TEXT,
  discord_server TEXT,
  scheduled_launch_date TIMESTAMP WITH TIME ZONE,
  launch_title TEXT,
  launch_description TEXT,
  launch_game TEXT,
  launch_thumbnail_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'scheduled', 'live', 'completed')),
  auto_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaigns table for clipping campaigns
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  campaign_image_url TEXT,
  prize_pool DECIMAL(10,2) DEFAULT 0,
  min_views_required INTEGER DEFAULT 1000,
  payout_per_1000_views DECIMAL(4,2) DEFAULT 1.30,
  max_payout_per_clip DECIMAL(6,2) DEFAULT 100,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'ended')),
  requirements JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clips table for submissions and performance tracking
CREATE TABLE public.clips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  -- Social media links
  instagram_url TEXT,
  tiktok_url TEXT,
  youtube_url TEXT,
  -- Performance tracking
  instagram_views INTEGER DEFAULT 0,
  tiktok_views INTEGER DEFAULT 0,
  youtube_views INTEGER DEFAULT 0,
  total_views INTEGER GENERATED ALWAYS AS (
    COALESCE(instagram_views, 0) + COALESCE(tiktok_views, 0) + COALESCE(youtube_views, 0)
  ) STORED,
  -- Payout calculation
  earned_amount DECIMAL(8,2) DEFAULT 0,
  payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'calculated', 'paid')),
  last_view_update TIMESTAMP WITH TIME ZONE DEFAULT now(),
  -- Status and verification
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'verified', 'approved', 'rejected')),
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payouts table for tracking payments
CREATE TABLE public.payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  clip_id UUID REFERENCES public.clips(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  amount DECIMAL(8,2) NOT NULL,
  views_count INTEGER NOT NULL,
  payout_rate DECIMAL(4,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streamers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for streamers
CREATE POLICY "Everyone can view approved streamers" ON public.streamers FOR SELECT USING (status IN ('approved', 'scheduled', 'live', 'completed'));
CREATE POLICY "Streamers can manage their own entries" ON public.streamers FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for campaigns
CREATE POLICY "Everyone can view active campaigns" ON public.campaigns FOR SELECT USING (status = 'active');
CREATE POLICY "Creators can manage their own campaigns" ON public.campaigns FOR ALL USING (auth.uid() = creator_id);

-- RLS Policies for clips (Fixed the error)
CREATE POLICY "Users can view clips for active campaigns" ON public.clips FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.campaigns WHERE campaigns.id = clips.campaign_id AND campaigns.status = 'active')
);
CREATE POLICY "Users can manage their own clips" ON public.clips FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for payouts
CREATE POLICY "Users can view their own payouts" ON public.payouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create payouts" ON public.payouts FOR INSERT WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_streamers_updated_at BEFORE UPDATE ON public.streamers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clips_updated_at BEFORE UPDATE ON public.clips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON public.payouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate clip earnings
CREATE OR REPLACE FUNCTION public.calculate_clip_earnings()
RETURNS TRIGGER AS $$
DECLARE
  campaign_payout_rate DECIMAL(4,2);
  campaign_max_payout DECIMAL(6,2);
  calculated_amount DECIMAL(8,2);
BEGIN
  -- Get campaign payout settings
  SELECT payout_per_1000_views, max_payout_per_clip 
  INTO campaign_payout_rate, campaign_max_payout
  FROM public.campaigns 
  WHERE id = NEW.campaign_id;
  
  -- Calculate earnings based on total views
  calculated_amount = (NEW.total_views / 1000.0) * campaign_payout_rate;
  
  -- Apply max payout limit
  IF calculated_amount > campaign_max_payout THEN
    calculated_amount = campaign_max_payout;
  END IF;
  
  NEW.earned_amount = calculated_amount;
  NEW.payout_status = 'calculated';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to auto-calculate earnings when views are updated
CREATE TRIGGER calculate_clip_earnings_trigger
  BEFORE UPDATE OF instagram_views, tiktok_views, youtube_views ON public.clips
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_clip_earnings();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_streamers_user_id ON public.streamers(user_id);
CREATE INDEX idx_streamers_launch_date ON public.streamers(scheduled_launch_date);
CREATE INDEX idx_campaigns_creator_id ON public.campaigns(creator_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_clips_user_id ON public.clips(user_id);
CREATE INDEX idx_clips_campaign_id ON public.clips(campaign_id);
CREATE INDEX idx_clips_total_views ON public.clips(total_views);
CREATE INDEX idx_payouts_user_id ON public.payouts(user_id);