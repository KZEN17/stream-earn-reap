-- Add enhanced campaign creation fields
ALTER TABLE public.campaigns 
ADD COLUMN IF NOT EXISTS target_countries text[],
ADD COLUMN IF NOT EXISTS campaign_rules text,
ADD COLUMN IF NOT EXISTS asset_requirements jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS approval_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS admin_notes text;

-- Create streamer applications table
CREATE TABLE IF NOT EXISTS public.streamer_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  twitch_username text,
  youtube_channel text,
  discord_server text,
  application_status text DEFAULT 'pending',
  scheduled_launch_date timestamp with time zone,
  launch_title text,
  launch_description text,
  launch_game text,
  launch_thumbnail_url text,
  admin_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on streamer applications
ALTER TABLE public.streamer_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for streamer applications
CREATE POLICY "Users can create their own applications" 
ON public.streamer_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications" 
ON public.streamer_applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" 
ON public.streamer_applications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RAID events table
CREATE TABLE IF NOT EXISTS public.raid_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  twitch_stream_url text,
  scheduled_time timestamp with time zone,
  status text DEFAULT 'scheduled',
  created_by uuid,
  max_participants integer DEFAULT 100,
  current_participants integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on RAID events
ALTER TABLE public.raid_events ENABLE ROW LEVEL SECURITY;

-- Create policies for RAID events
CREATE POLICY "Everyone can view active raids" 
ON public.raid_events 
FOR SELECT 
USING (status IN ('scheduled', 'live'));

CREATE POLICY "Admins can manage raids" 
ON public.raid_events 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() 
  AND user_type = 'admin'
));

-- Add admin role support to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  campaign_updates boolean DEFAULT true,
  raid_alerts boolean DEFAULT true,
  payout_notifications boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on notification preferences
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for notification preferences
CREATE POLICY "Users can manage their own preferences" 
ON public.notification_preferences 
FOR ALL 
USING (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_streamer_applications_updated_at
BEFORE UPDATE ON public.streamer_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_raid_events_updated_at
BEFORE UPDATE ON public.raid_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();