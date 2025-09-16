import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  total_views: number;
  total_earnings: number;
  total_clips: number;
  views_this_week: number;
  earnings_this_week: number;
  clips_this_week: number;
  rank_position: number;
}

export const useLeaderboards = (timeFilter: 'week' | 'all-time' = 'week') => {
  const [streamers, setStreamers] = useState<LeaderboardEntry[]>([]);
  const [clippers, setClippers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboards = async () => {
    try {
      setLoading(true);
      
      // First fetch user stats
      const { data: userStats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .order(timeFilter === 'week' ? 'views_this_week' : 'total_views', { ascending: false })
        .limit(50);

      if (statsError) throw statsError;

      if (!userStats || userStats.length === 0) {
        setStreamers([]);
        setClippers([]);
        return;
      }

      // Then fetch corresponding profiles
      const userIds = userStats.map(stat => stat.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, username, display_name, avatar_url, user_type')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      const leaderboardData = userStats.map((stat, index) => {
        const profile = profiles?.find(p => p.user_id === stat.user_id);
        return {
          id: stat.id,
          user_id: stat.user_id,
          username: profile?.username || 'Anonymous',
          display_name: profile?.display_name || 'Anonymous',
          avatar_url: profile?.avatar_url,
          total_views: stat.total_views,
          total_earnings: stat.total_earnings,
          total_clips: stat.total_clips,
          views_this_week: stat.views_this_week,
          earnings_this_week: stat.earnings_this_week,
          clips_this_week: stat.clips_this_week,
          rank_position: index + 1
        };
      });

      // Separate streamers and clippers based on user_type
      const streamersData = leaderboardData.filter(entry => {
        const profile = profiles?.find(p => p.user_id === entry.user_id);
        return profile?.user_type === 'streamer';
      });

      const clippersData = leaderboardData.filter(entry => {
        const profile = profiles?.find(p => p.user_id === entry.user_id);
        return profile?.user_type === 'creator' || !profile?.user_type;
      });

      setStreamers(streamersData);
      setClippers(clippersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboards();

    // Set up real-time subscription
    const channel = supabase
      .channel('user-stats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_stats'
        },
        () => {
          fetchLeaderboards();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [timeFilter]);

  return {
    streamers,
    clippers,
    loading,
    error,
    fetchLeaderboards
  };
};