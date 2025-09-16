-- Add escrow and milestone tracking to campaigns table
ALTER TABLE public.campaigns 
ADD COLUMN escrow_usdc DECIMAL(10,2) DEFAULT 0,
ADD COLUMN escrow_cap_usdc DECIMAL(10,2) DEFAULT 0,
ADD COLUMN rate_usd_per_k DECIMAL(4,2) DEFAULT 1.30,
ADD COLUMN payout_paused BOOLEAN DEFAULT false,
ADD COLUMN anomaly_detected BOOLEAN DEFAULT false,
ADD COLUMN manual_approval_required BOOLEAN DEFAULT false;

-- Add milestone tracking to clips table  
ALTER TABLE public.clips
ADD COLUMN verified_views INTEGER DEFAULT 0,
ADD COLUMN milestones_paid INTEGER DEFAULT 0,
ADD COLUMN creator_wallet TEXT,
ADD COLUMN anomaly_flagged BOOLEAN DEFAULT false;

-- Create payout_tasks table for queuing
CREATE TABLE public.payout_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idempotency_key TEXT NOT NULL UNIQUE,
  clip_id UUID NOT NULL REFERENCES public.clips(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  milestone_number INTEGER NOT NULL,
  amount_usdc DECIMAL(8,2) NOT NULL,
  creator_wallet TEXT NOT NULL,
  status TEXT DEFAULT 'queued'::text CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Create payout_transactions table for batch records
CREATE TABLE public.payout_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tx_hash TEXT,
  wallet_address TEXT NOT NULL,
  total_amount_usdc DECIMAL(10,2) NOT NULL,
  task_count INTEGER NOT NULL,
  batch_period TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'pending'::text CHECK (status IN ('pending', 'confirmed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  gas_fee_usdc DECIMAL(8,4),
  error_message TEXT
);

-- Link payout tasks to transactions
ALTER TABLE public.payout_tasks 
ADD COLUMN transaction_id UUID REFERENCES public.payout_transactions(id);

-- Enable RLS on new tables
ALTER TABLE public.payout_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for payout_tasks
CREATE POLICY "Users can view their own payout tasks" 
ON public.payout_tasks 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.clips 
    WHERE clips.id = payout_tasks.clip_id 
    AND clips.user_id = auth.uid()
  )
);

CREATE POLICY "Campaign creators can view tasks for their campaigns" 
ON public.payout_tasks 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.campaigns 
    WHERE campaigns.id = payout_tasks.campaign_id 
    AND campaigns.creator_id = auth.uid()
  )
);

-- RLS policies for payout_transactions  
CREATE POLICY "Users can view their own payout transactions" 
ON public.payout_transactions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.payout_tasks pt
    JOIN public.clips c ON c.id = pt.clip_id
    WHERE pt.transaction_id = payout_transactions.id 
    AND c.user_id = auth.uid()
  )
);

CREATE POLICY "Campaign creators can view transactions for their campaigns" 
ON public.payout_transactions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.payout_tasks pt
    JOIN public.campaigns camp ON camp.id = pt.campaign_id
    WHERE pt.transaction_id = payout_transactions.id 
    AND camp.creator_id = auth.uid()
  )
);

-- Create function to calculate and enqueue milestone payouts
CREATE OR REPLACE FUNCTION public.enqueue_milestone_payouts()
RETURNS TRIGGER AS $$
DECLARE
  campaign_rate DECIMAL(4,2);
  campaign_escrow DECIMAL(10,2);
  campaign_paused BOOLEAN;
  milestones_earned INTEGER;
  new_milestones INTEGER;
  milestone_amount DECIMAL(8,2);
  i INTEGER;
  idempotency_key TEXT;
BEGIN
  -- Only process if verified_views actually increased
  IF OLD.verified_views IS NOT DISTINCT FROM NEW.verified_views THEN
    RETURN NEW;
  END IF;

  -- Get campaign settings
  SELECT rate_usd_per_k, escrow_usdc, payout_paused 
  INTO campaign_rate, campaign_escrow, campaign_paused
  FROM public.campaigns 
  WHERE id = NEW.campaign_id;

  -- Skip if payouts are paused or insufficient escrow
  IF campaign_paused OR campaign_escrow <= 0 THEN
    RETURN NEW;
  END IF;

  -- Calculate milestones earned and new ones to pay
  milestones_earned = FLOOR(NEW.verified_views / 1000);
  new_milestones = milestones_earned - COALESCE(NEW.milestones_paid, 0);
  
  -- Skip if no new milestones
  IF new_milestones <= 0 THEN
    RETURN NEW;
  END IF;

  milestone_amount = campaign_rate;

  -- Enqueue payout tasks for each new milestone
  FOR i IN 1..new_milestones LOOP
    -- Check if enough escrow remains
    IF campaign_escrow < milestone_amount THEN
      EXIT; -- Stop creating tasks if escrow insufficient
    END IF;

    idempotency_key = NEW.id::text || '-milestone-' || (COALESCE(NEW.milestones_paid, 0) + i)::text;
    
    -- Insert payout task with idempotency protection
    INSERT INTO public.payout_tasks (
      idempotency_key,
      clip_id,
      campaign_id,
      milestone_number,
      amount_usdc,
      creator_wallet
    ) VALUES (
      idempotency_key,
      NEW.id,
      NEW.campaign_id,
      COALESCE(NEW.milestones_paid, 0) + i,
      milestone_amount,
      COALESCE(NEW.creator_wallet, 'wallet_not_set')
    ) ON CONFLICT (idempotency_key) DO NOTHING;
    
    campaign_escrow = campaign_escrow - milestone_amount;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for milestone enqueuing
CREATE TRIGGER trigger_enqueue_milestone_payouts
  AFTER UPDATE OF verified_views ON public.clips
  FOR EACH ROW
  EXECUTE FUNCTION public.enqueue_milestone_payouts();

-- Create indexes for performance
CREATE INDEX idx_payout_tasks_status_created ON public.payout_tasks(status, created_at);
CREATE INDEX idx_payout_tasks_clip_campaign ON public.payout_tasks(clip_id, campaign_id);
CREATE INDEX idx_payout_transactions_wallet_period ON public.payout_transactions(wallet_address, batch_period);
CREATE INDEX idx_clips_verified_views ON public.clips(verified_views);
CREATE INDEX idx_campaigns_escrow ON public.campaigns(escrow_usdc);