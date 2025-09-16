-- Create a function to notify campaign owners when clips are submitted
CREATE OR REPLACE FUNCTION public.notify_campaign_owner_on_clip_submission()
RETURNS TRIGGER AS $$
DECLARE
  campaign_owner_id UUID;
  campaign_title TEXT;
  clip_title TEXT;
  submitter_name TEXT;
BEGIN
  -- Get campaign owner and title
  SELECT creator_id, title INTO campaign_owner_id, campaign_title
  FROM public.campaigns 
  WHERE id = NEW.campaign_id;
  
  -- Get submitter's display name
  SELECT display_name INTO submitter_name
  FROM public.profiles 
  WHERE user_id = NEW.user_id;
  
  -- Only create notification if the submitter is not the campaign owner
  IF campaign_owner_id IS NOT NULL AND campaign_owner_id != NEW.user_id THEN
    -- Create notification for campaign owner
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      type,
      action_url
    ) VALUES (
      campaign_owner_id,
      'New Clip Submission',
      COALESCE(submitter_name, 'A user') || ' submitted a clip "' || NEW.title || '" to your campaign "' || campaign_title || '"',
      'info',
      '/campaign-analytics/' || NEW.campaign_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to fire on clip insertions
CREATE TRIGGER trigger_notify_campaign_owner_on_clip_submission
  AFTER INSERT ON public.clips
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_campaign_owner_on_clip_submission();

-- Also create a function to notify on clip status changes (approve/reject)
CREATE OR REPLACE FUNCTION public.notify_user_on_clip_status_change()
RETURNS TRIGGER AS $$
DECLARE
  campaign_title TEXT;
  user_name TEXT;
BEGIN
  -- Only proceed if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Get campaign title
    SELECT title INTO campaign_title
    FROM public.campaigns 
    WHERE id = NEW.campaign_id;
    
    -- Get user's display name
    SELECT display_name INTO user_name
    FROM public.profiles 
    WHERE user_id = NEW.user_id;
    
    -- Create notification for clip submitter based on new status
    IF NEW.status = 'approved' THEN
      INSERT INTO public.notifications (
        user_id,
        title,
        message,
        type,
        action_url
      ) VALUES (
        NEW.user_id,
        'Clip Approved! 🎉',
        'Your clip "' || NEW.title || '" has been approved for campaign "' || campaign_title || '"',
        'info',
        '/profile'
      );
    ELSIF NEW.status = 'rejected' THEN
      INSERT INTO public.notifications (
        user_id,
        title,
        message,
        type,
        action_url
      ) VALUES (
        NEW.user_id,
        'Clip Review Update',
        'Your clip "' || NEW.title || '" needs some adjustments for campaign "' || campaign_title || '"' ||
        CASE WHEN NEW.rejection_reason IS NOT NULL THEN '. Reason: ' || NEW.rejection_reason ELSE '' END,
        'info',
        '/profile'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to fire on clip updates
CREATE TRIGGER trigger_notify_user_on_clip_status_change
  AFTER UPDATE ON public.clips
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_user_on_clip_status_change();