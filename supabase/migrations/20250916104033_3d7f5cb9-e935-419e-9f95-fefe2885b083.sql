-- Add new fields to raid_events table for improved RAID creation flow
ALTER TABLE public.raid_events 
ADD COLUMN IF NOT EXISTS target_url TEXT,
ADD COLUMN IF NOT EXISTS mission_type TEXT CHECK (mission_type IN ('mission', 'takeover', 'support')) DEFAULT 'mission',
ADD COLUMN IF NOT EXISTS leader_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS goal_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_raised NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS goal_description TEXT;

-- Update the useRaidEvents hook interface and create RaidCreator component
-- Mission types:
-- - mission: grow a launch/event  
-- - takeover: push a streamer into trending/top lists
-- - support: boost an ally streamer or community event