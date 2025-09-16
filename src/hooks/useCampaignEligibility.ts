import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CampaignEligibility {
  eligible: boolean;
  missingPlatforms: string[];
  connectedPlatforms: Array<{
    platform: string;
    username: string;
    verified: boolean;
  }>;
  requiredPlatforms: string[];
}

export const useCampaignEligibility = (campaignId?: string) => {
  const [eligibility, setEligibility] = useState<CampaignEligibility | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const checkEligibility = async (id?: string) => {
    const targetCampaignId = id || campaignId;
    if (!targetCampaignId || !user) return;

    try {
      setLoading(true);
      setError(null);

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('check-campaign-eligibility', {
        body: { campaignId: targetCampaignId },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setEligibility(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check eligibility');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campaignId && user) {
      checkEligibility();
    }
  }, [campaignId, user]);

  return {
    eligibility,
    loading,
    error,
    checkEligibility
  };
};