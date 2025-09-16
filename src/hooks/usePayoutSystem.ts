import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PayoutTask {
  id: string;
  idempotency_key: string;
  clip_id: string;
  campaign_id: string;
  milestone_number: number;
  amount_usdc: number;
  creator_wallet: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  processed_at?: string;
  error_message?: string;
  transaction_id?: string;
}

export interface PayoutTransaction {
  id: string;
  tx_hash?: string;
  wallet_address: string;
  total_amount_usdc: number;
  task_count: number;
  batch_period: string;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
  confirmed_at?: string;
  gas_fee_usdc?: number;
  error_message?: string;
}

export interface CampaignEscrow {
  escrow_usdc: number;
  escrow_cap_usdc: number;
  rate_usd_per_k: number;
  payout_paused: boolean;
  anomaly_detected: boolean;
  manual_approval_required: boolean;
}

export const usePayoutSystem = (campaignId?: string) => {
  const [payoutTasks, setPayoutTasks] = useState<PayoutTask[]>([]);
  const [payoutTransactions, setPayoutTransactions] = useState<PayoutTransaction[]>([]);
  const [campaignEscrow, setCampaignEscrow] = useState<CampaignEscrow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPayoutData = async () => {
    if (!user || !campaignId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch campaign escrow data
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .select('escrow_usdc, escrow_cap_usdc, rate_usd_per_k, payout_paused, anomaly_detected, manual_approval_required')
        .eq('id', campaignId)
        .single();

      if (campaignError) throw campaignError;
      setCampaignEscrow(campaignData);

      // Fetch payout tasks for this campaign
      const { data: tasksData, error: tasksError } = await supabase
        .from('payout_tasks')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;
      setPayoutTasks(tasksData as PayoutTask[] || []);

      // Fetch payout transactions for this campaign
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('payout_transactions')
        .select(`
          *,
          payout_tasks!inner(campaign_id)
        `)
        .eq('payout_tasks.campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;
      setPayoutTransactions(transactionsData as PayoutTransaction[] || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payout data');
    } finally {
      setLoading(false);
    }
  };

  const updateCampaignEscrow = async (updates: Partial<CampaignEscrow>) => {
    if (!campaignId) return;

    try {
      const { error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', campaignId);

      if (error) throw error;
      
      setCampaignEscrow(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update campaign');
    }
  };

  const pausePayouts = async (paused: boolean) => {
    await updateCampaignEscrow({ payout_paused: paused });
  };

  const setManualApproval = async (required: boolean) => {
    await updateCampaignEscrow({ manual_approval_required: required });
  };

  const addEscrowFunds = async (amount: number) => {
    if (!campaignEscrow) return;
    
    const newEscrow = campaignEscrow.escrow_usdc + amount;
    await updateCampaignEscrow({ escrow_usdc: newEscrow });
  };

  useEffect(() => {
    fetchPayoutData();

    // Set up real-time subscription for payout updates
    const channel = supabase
      .channel('payout-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payout_tasks',
          filter: `campaign_id=eq.${campaignId}`
        },
        () => {
          fetchPayoutData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payout_transactions'
        },
        () => {
          fetchPayoutData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId, user]);

  return {
    payoutTasks,
    payoutTransactions,
    campaignEscrow,
    loading,
    error,
    pausePayouts,
    setManualApproval,
    addEscrowFunds,
    refetch: fetchPayoutData
  };
};