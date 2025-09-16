-- Create the user_type enum
CREATE TYPE user_type AS ENUM ('clipper', 'streamer', 'agency');

-- Add new fields for role-specific data first
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS agency_name TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS streaming_platform TEXT,
ADD COLUMN IF NOT EXISTS wallet_address TEXT,
ADD COLUMN IF NOT EXISTS team_contact_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS managed_streamers TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Update existing user_type column to use enum
-- First update any existing 'creator' values to 'streamer'
UPDATE profiles SET user_type = 'streamer' WHERE user_type = 'creator';

-- Now convert the column to use the enum
ALTER TABLE profiles 
ALTER COLUMN user_type TYPE user_type USING 
  CASE 
    WHEN user_type = 'creator' THEN 'streamer'::user_type
    WHEN user_type = 'clipper' THEN 'clipper'::user_type
    WHEN user_type = 'streamer' THEN 'streamer'::user_type  
    WHEN user_type = 'agency' THEN 'agency'::user_type
    ELSE 'clipper'::user_type
  END;

-- Set the default value for user_type
ALTER TABLE profiles 
ALTER COLUMN user_type SET DEFAULT 'clipper';