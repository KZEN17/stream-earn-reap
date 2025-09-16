-- Create user_wallets table for Privy wallet integration
CREATE TABLE public.user_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  address TEXT NOT NULL,
  chain_type TEXT NOT NULL, -- 'ethereum', 'solana', 'bitcoin'
  chain_id INTEGER, -- for EVM chains
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_public BOOLEAN NOT NULL DEFAULT false,
  label TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT unique_user_address UNIQUE (user_id, address),
  CONSTRAINT valid_chain_type CHECK (chain_type IN ('ethereum', 'solana', 'bitcoin'))
);

-- Enable RLS
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own wallets" ON public.user_wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallets" ON public.user_wallets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallets" ON public.user_wallets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wallets" ON public.user_wallets
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_wallets_updated_at
  BEFORE UPDATE ON public.user_wallets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create wallet audit log table
CREATE TABLE public.wallet_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  wallet_address TEXT NOT NULL,
  chain_type TEXT NOT NULL,
  action TEXT NOT NULL, -- 'verify', 'set_default', 'remove', 'link'
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for audit log
ALTER TABLE public.wallet_audit_log ENABLE ROW LEVEL SECURITY;

-- Audit log policies (read-only for users, write for system)
CREATE POLICY "Users can view their own audit logs" ON public.wallet_audit_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert audit logs" ON public.wallet_audit_log
  FOR INSERT WITH CHECK (true);

-- Function to ensure only one default wallet per user
CREATE OR REPLACE FUNCTION public.ensure_single_default_wallet()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting a wallet as default, unset all other defaults for this user
  IF NEW.is_default = true THEN
    UPDATE public.user_wallets 
    SET is_default = false, updated_at = now()
    WHERE user_id = NEW.user_id 
      AND address != NEW.address 
      AND is_default = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for default wallet enforcement
CREATE TRIGGER ensure_single_default_wallet_trigger
  BEFORE INSERT OR UPDATE ON public.user_wallets
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_single_default_wallet();

-- Create indexes for performance
CREATE INDEX idx_user_wallets_user_id ON public.user_wallets(user_id);
CREATE INDEX idx_user_wallets_address ON public.user_wallets(address);
CREATE INDEX idx_user_wallets_default ON public.user_wallets(user_id, is_default) WHERE is_default = true;
CREATE INDEX idx_wallet_audit_log_user_id ON public.wallet_audit_log(user_id);
CREATE INDEX idx_wallet_audit_log_created_at ON public.wallet_audit_log(created_at);