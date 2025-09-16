import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Campaign {
  id: string;
  title: string;
  description?: string;
  campaign_image_url?: string;
  prize_pool?: number;
  payout_per_1000_views?: number;
  max_payout_per_clip?: number;
  start_date?: string;
  end_date?: string;
  status: string;
  tags?: string[];
  participants_count?: number;
  total_submissions?: number;
  category?: string;
}

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const joinCampaign = async (campaignId: string) => {
    if (!user) throw new Error('Must be logged in to join campaign');
    
    // This will be handled in the submission modal
    return { success: true };
  };

  useEffect(() => {
    fetchCampaigns();

    // Set up real-time subscription
    const channel = supabase
      .channel('campaigns-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaigns'
        },
        () => {
          fetchCampaigns();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    joinCampaign
  };
};