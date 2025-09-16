-- Add auto_approve setting to campaigns table
ALTER TABLE public.campaigns 
ADD COLUMN auto_approve boolean DEFAULT false;

-- Add rejection_reason to clips table for rejected submissions
ALTER TABLE public.clips 
ADD COLUMN rejection_reason text;

-- Add approval_date to clips table to track when clips were approved
ALTER TABLE public.clips 
ADD COLUMN approval_date timestamp with time zone;