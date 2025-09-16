-- Fix the user_type constraint to allow 'clipper' value
DO $$ 
BEGIN
    -- Check if the constraint exists and drop it if needed
    IF EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'profiles_user_type_check'
    ) THEN
        ALTER TABLE public.profiles DROP CONSTRAINT profiles_user_type_check;
    END IF;
END $$;

-- Add a proper check constraint that allows the values we're using
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type IN ('clipper', 'streamer', 'agency', 'creator', 'admin'));