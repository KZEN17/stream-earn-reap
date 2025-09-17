import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface LaunchEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  game?: string;
  platform: string;
  scheduled_date: string;
  max_participants: number;
  current_participants: number;
  status: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export const useLaunchEvents = () => {
  const [events, setEvents] = useState<LaunchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('launch_events')
        .select('*')
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: {
    title: string;
    description?: string;
    game?: string;
    platform?: string;
    scheduled_date: string;
    max_participants?: number;
    thumbnail_url?: string;
  }) => {
    if (!user) throw new Error('Must be logged in to create event');
    
    try {
      const { data, error } = await supabase
        .from('launch_events')
        .insert({
          ...eventData,
          user_id: user.id,
          platform: eventData.platform || 'twitch',
          max_participants: eventData.max_participants || 50,
          current_participants: 0,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchEvents();
      return { success: true, data };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create event');
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<LaunchEvent>) => {
    if (!user) throw new Error('Must be logged in to update event');
    
    try {
      const { data, error } = await supabase
        .from('launch_events')
        .update(updates)
        .eq('id', eventId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchEvents();
      return { success: true, data };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update event');
    }
  };

  const joinEvent = async (eventId: string) => {
    if (!user) throw new Error('Must be logged in to join event');
    
    try {
      // Find the event first
      const { data: event, error: fetchError } = await supabase
        .from('launch_events')
        .select('current_participants, max_participants')
        .eq('id', eventId)
        .single();

      if (fetchError) throw fetchError;
      
      if (event.current_participants >= event.max_participants) {
        throw new Error('Event is full');
      }

      // Update participant count
      const { data, error } = await supabase
        .from('launch_events')
        .update({ 
          current_participants: event.current_participants + 1 
        })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      
      await fetchEvents();
      return { success: true, data };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to join event');
    }
  };

  useEffect(() => {
    fetchEvents();

    // Set up real-time subscription
    const channel = supabase
      .channel('launch-events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'launch_events'
        },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    joinEvent
  };
};