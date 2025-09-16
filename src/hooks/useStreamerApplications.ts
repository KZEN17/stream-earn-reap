import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface StreamerApplication {
  id: string;
  user_id: string;
  twitch_username?: string;
  youtube_channel?: string;
  discord_server?: string;
  application_status: string;
  scheduled_launch_date?: string;
  launch_title?: string;
  launch_description?: string;
  launch_game?: string;
  launch_thumbnail_url?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export const useStreamerApplications = () => {
  const [applications, setApplications] = useState<StreamerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('streamer_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const submitApplication = async (applicationData: Partial<StreamerApplication>) => {
    if (!user) throw new Error('Must be logged in to submit application');
    
    try {
      const { data, error } = await supabase
        .from('streamer_applications')
        .insert({
          ...applicationData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchApplications();
      return { success: true, data };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to submit application');
    }
  };

  useEffect(() => {
    if (user) {
      fetchApplications();

      // Set up real-time subscription
      const channel = supabase
        .channel('streamer-applications-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'streamer_applications'
          },
          () => {
            fetchApplications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    submitApplication
  };
};