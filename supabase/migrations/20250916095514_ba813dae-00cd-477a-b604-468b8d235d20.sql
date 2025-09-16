-- Add new fields for role-specific data
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS agency_name TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS streaming_platform TEXT,
ADD COLUMN IF NOT EXISTS wallet_address TEXT,
ADD COLUMN IF NOT EXISTS team_contact_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS managed_streamers TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Update existing 'creator' values to 'streamer' to align with new role system
UPDATE profiles SET user_type = 'streamer' WHERE user_type = 'creator';