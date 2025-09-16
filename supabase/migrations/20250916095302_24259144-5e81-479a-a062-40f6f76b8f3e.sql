-- Update user_type enum to include the three main roles
ALTER TYPE user_type RENAME TO user_type_old;
CREATE TYPE user_type AS ENUM ('clipper', 'streamer', 'agency');

-- Update the profiles table to use the new enum
ALTER TABLE profiles 
ALTER COLUMN user_type TYPE user_type USING user_type::text::user_type;

-- Drop the old enum
DROP TYPE user_type_old;

-- Add new fields for role-specific data
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS agency_name TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS streaming_platform TEXT,
ADD COLUMN IF NOT EXISTS wallet_address TEXT,
ADD COLUMN IF NOT EXISTS team_contact_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS managed_streamers TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Update the default value for user_type
ALTER TABLE profiles 
ALTER COLUMN user_type SET DEFAULT 'clipper';