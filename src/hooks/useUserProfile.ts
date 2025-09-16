import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserProfile {
  id: string;
  user_id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  instagram_username?: string;
  tiktok_username?: string;
  youtube_channel_id?: string;
  instagram_connected?: boolean;
  tiktok_connected?: boolean;
  youtube_connected?: boolean;
  user_type?: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, this is handled in AuthContext
          setProfile(null);
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('Must be logged in to update profile');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update profile');
    }
  };

  const connectSocialMedia = async (platform: 'instagram' | 'tiktok' | 'youtube', username: string) => {
    const updates = {
      [`${platform}_username`]: username,
      [`${platform}_connected`]: true
    };
    
    return await updateProfile(updates);
  };

  const disconnectSocialMedia = async (platform: 'instagram' | 'tiktok' | 'youtube') => {
    const updates = {
      [`${platform}_username`]: null,
      [`${platform}_connected`]: false
    };
    
    return await updateProfile(updates);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    connectSocialMedia,
    disconnectSocialMedia
  };
};