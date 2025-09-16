import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Clip {
  id: string;
  user_id: string;
  campaign_id: string;
  title: string;
  description?: string;
  instagram_url?: string;
  tiktok_url?: string;
  youtube_url?: string;
  instagram_views?: number;
  tiktok_views?: number;
  youtube_views?: number;
  total_views?: number;
  earned_amount?: number;
  status: string;
  thumbnail_url?: string;
  video_url?: string;
  created_at: string;
  payout_status?: string;
}

export const useClips = (campaignId?: string) => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchClips = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('clips')
        .select(`
          *,
          campaigns!inner(*)
        `)
        .order('created_at', { ascending: false });

      if (campaignId) {
        query = query.eq('campaign_id', campaignId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setClips(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clips');
    } finally {
      setLoading(false);
    }
  };

  const submitClip = async (clipData: {
    campaign_id: string;
    title: string;
    description?: string;
    instagram_url?: string;
    tiktok_url?: string;
    youtube_url?: string;
    video_file?: File;
  }) => {
    if (!user) throw new Error('Must be logged in to submit clip');

    try {
      let video_url = null;
      let thumbnail_url = null;

      // Upload video file if provided
      if (clipData.video_file) {
        const fileExt = clipData.video_file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('clips')
          .upload(fileName, clipData.video_file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('clips')
          .getPublicUrl(uploadData.path);
        
        video_url = publicUrl;
        thumbnail_url = publicUrl; // For now, use same URL for thumbnail
      }

      const { data, error } = await supabase
        .from('clips')
        .insert({
          user_id: user.id,
          campaign_id: clipData.campaign_id,
          title: clipData.title,
          description: clipData.description,
          instagram_url: clipData.instagram_url,
          tiktok_url: clipData.tiktok_url,
          youtube_url: clipData.youtube_url,
          video_url,
          thumbnail_url,
          status: 'submitted'
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchClips();
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to submit clip');
    }
  };

  useEffect(() => {
    fetchClips();

    // Set up real-time subscription
    const channel = supabase
      .channel('clips-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clips'
        },
        () => {
          fetchClips();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  return {
    clips,
    loading,
    error,
    fetchClips,
    submitClip
  };
};