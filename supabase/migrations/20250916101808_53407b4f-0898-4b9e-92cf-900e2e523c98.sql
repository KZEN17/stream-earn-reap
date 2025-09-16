-- Fix storage RLS policies for avatar uploads
CREATE POLICY "Users can upload their own avatars" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'user-avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatars" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'user-avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatars" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'user-avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Check if there's a constraint on user_type and drop it if it's too restrictive
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