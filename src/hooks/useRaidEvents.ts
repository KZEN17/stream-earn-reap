import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface RaidEvent {
  id: string;
  title: string;
  description?: string;
  twitch_stream_url?: string;
  scheduled_time?: string;
  status: string;
  created_by?: string;
  max_participants?: number;
  current_participants?: number;
  created_at: string;
  updated_at: string;
  target_url?: string;
  mission_type?: 'mission' | 'takeover' | 'support';
  leader_id?: string;
  goal_amount?: number;
  total_raised?: number;
  goal_description?: string;
}

export const useRaidEvents = () => {
  const [raids, setRaids] = useState<RaidEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchRaids = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('raid_events')
        .select('*')
        .order('scheduled_time', { ascending: true });

      if (error) throw error;
      // Type cast mission_type to ensure proper typing
      const typedData = (data || []).map(raid => ({
        ...raid,
        mission_type: raid.mission_type as 'mission' | 'takeover' | 'support' | undefined
      }));
      setRaids(typedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch raids');
    } finally {
      setLoading(false);
    }
  };

  const createRaid = async (raidData: Omit<RaidEvent, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('Must be logged in to create raid');
    
    try {
      const { data, error } = await supabase
        .from('raid_events')
        .insert({
          ...raidData,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchRaids();
      return { success: true, data };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create raid');
    }
  };

  const joinRaid = async (raidId: string) => {
    try {
      const raid = raids.find(r => r.id === raidId);
      if (!raid) throw new Error('Raid not found');
      
      if ((raid.current_participants || 0) >= (raid.max_participants || 100)) {
        throw new Error('Raid is full');
      }

      const { error } = await supabase
        .from('raid_events')
        .update({ 
          current_participants: (raid.current_participants || 0) + 1 
        })
        .eq('id', raidId);

      if (error) throw error;
      
      await fetchRaids();
      return { success: true };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to join raid');
    }
  };

  useEffect(() => {
    fetchRaids();

    // Set up real-time subscription
    const channel = supabase
      .channel('raid-events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'raid_events'
        },
        () => {
          fetchRaids();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    raids,
    loading,
    error,
    fetchRaids,
    createRaid,
    joinRaid
  };
};