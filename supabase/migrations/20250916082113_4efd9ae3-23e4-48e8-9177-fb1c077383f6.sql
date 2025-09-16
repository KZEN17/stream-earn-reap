-- Create storage buckets for clips and campaign images
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('clips', 'clips', true),
  ('campaign-images', 'campaign-images', true),
  ('user-avatars', 'user-avatars', true);

-- Create storage policies for clips
CREATE POLICY "Users can upload their own clips" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'clips' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Everyone can view clips" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'clips');

CREATE POLICY "Users can update their own clips" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'clips' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for campaign images
CREATE POLICY "Campaign creators can upload images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'campaign-images');

CREATE POLICY "Everyone can view campaign images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'campaign-images');

-- Create storage policies for user avatars
CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Everyone can view avatars" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add more columns to campaigns table
ALTER TABLE public.campaigns 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS participants_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_submissions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';

-- Add more columns to clips table  
ALTER TABLE public.clips
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS submission_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Create launch_events table for calendar
CREATE TABLE IF NOT EXISTS public.launch_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  game TEXT,
  platform TEXT DEFAULT 'twitch',
  thumbnail_url TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  max_participants INTEGER DEFAULT 50,
  current_participants INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on launch_events
ALTER TABLE public.launch_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for launch_events
CREATE POLICY "Users can manage their own events" 
ON public.launch_events 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view scheduled/live events" 
ON public.launch_events 
FOR SELECT 
USING (status IN ('scheduled', 'live', 'completed'));

-- Create user_stats table for tracking performance
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_clips INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  clips_this_week INTEGER DEFAULT 0,
  views_this_week INTEGER DEFAULT 0,
  earnings_this_week DECIMAL(8,2) DEFAULT 0,
  rank_position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_stats
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_stats
CREATE POLICY "Users can view their own stats" 
ON public.user_stats 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" 
ON public.user_stats 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can create user stats" 
ON public.user_stats 
FOR INSERT 
WITH CHECK (true);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_launch_events_updated_at
BEFORE UPDATE ON public.launch_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
BEFORE UPDATE ON public.user_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for important tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.clips;
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaigns;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_stats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.launch_events;

-- Set replica identity for realtime
ALTER TABLE public.clips REPLICA IDENTITY FULL;
ALTER TABLE public.campaigns REPLICA IDENTITY FULL;
ALTER TABLE public.user_stats REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.launch_events REPLICA IDENTITY FULL;