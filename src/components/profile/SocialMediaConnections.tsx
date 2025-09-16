import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Instagram, Music, Youtube, Check, X } from 'lucide-react';

interface Profile {
  instagram_username: string;
  instagram_connected: boolean;
  tiktok_username: string;
  tiktok_connected: boolean;
  youtube_channel_id: string;
  youtube_connected: boolean;
}

export default function SocialMediaConnections() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    instagram_username: '',
    instagram_connected: false,
    tiktok_username: '',
    tiktok_connected: false,
    youtube_channel_id: '',
    youtube_connected: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('instagram_username, instagram_connected, tiktok_username, tiktok_connected, youtube_channel_id, youtube_connected')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleConnect = async (platform: 'instagram' | 'tiktok' | 'youtube', username: string) => {
    setLoading(true);
    try {
      const updates: any = {};
      updates[`${platform}_username`] = username;
      updates[`${platform}_connected`] = true;

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user?.id);

      if (error) throw error;

      setProfile(prev => ({
        ...prev,
        ...updates,
      }));

      toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} connected successfully!`);
    } catch (error) {
      toast.error('Failed to connect account');
      console.error('Error connecting account:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (platform: 'instagram' | 'tiktok' | 'youtube') => {
    setLoading(true);
    try {
      const updates: any = {};
      updates[`${platform}_username`] = '';
      updates[`${platform}_connected`] = false;

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user?.id);

      if (error) throw error;

      setProfile(prev => ({
        ...prev,
        ...updates,
      }));

      toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} disconnected`);
    } catch (error) {
      toast.error('Failed to disconnect account');
      console.error('Error disconnecting account:', error);
    } finally {
      setLoading(false);
    }
  };

  const SocialPlatformCard = ({ 
    platform, 
    icon, 
    name, 
    username, 
    connected, 
    onConnect, 
    onDisconnect 
  }: {
    platform: string;
    icon: React.ReactNode;
    name: string;
    username: string;
    connected: boolean;
    onConnect: (username: string) => void;
    onDisconnect: () => void;
  }) => {
    const [localUsername, setLocalUsername] = useState(username);

    return (
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            {icon}
            <CardTitle className="text-lg">{name}</CardTitle>
          </div>
          <div className="ml-auto">
            {connected ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <Check className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline">
                <X className="w-3 h-3 mr-1" />
                Not Connected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {connected ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Connected as: <span className="font-medium">@{username}</span>
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onDisconnect}
                disabled={loading}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor={`${platform}-username`}>Username</Label>
                <Input
                  id={`${platform}-username`}
                  placeholder={`Enter your ${name} username`}
                  value={localUsername}
                  onChange={(e) => setLocalUsername(e.target.value)}
                />
              </div>
              <Button
                onClick={() => onConnect(localUsername)}
                disabled={!localUsername.trim() || loading}
                size="sm"
              >
                Connect {name}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Social Media Connections</h2>
        <p className="text-muted-foreground">
          Connect your social media accounts to submit clips and track performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SocialPlatformCard
          platform="instagram"
          icon={<Instagram className="w-5 h-5 text-pink-500" />}
          name="Instagram"
          username={profile.instagram_username}
          connected={profile.instagram_connected}
          onConnect={(username) => handleConnect('instagram', username)}
          onDisconnect={() => handleDisconnect('instagram')}
        />

        <SocialPlatformCard
          platform="tiktok"
          icon={<Music className="w-5 h-5 text-black dark:text-white" />}
          name="TikTok"
          username={profile.tiktok_username}
          connected={profile.tiktok_connected}
          onConnect={(username) => handleConnect('tiktok', username)}
          onDisconnect={() => handleDisconnect('tiktok')}
        />

        <SocialPlatformCard
          platform="youtube"
          icon={<Youtube className="w-5 h-5 text-red-500" />}
          name="YouTube"
          username={profile.youtube_channel_id}
          connected={profile.youtube_connected}
          onConnect={(username) => handleConnect('youtube', username)}
          onDisconnect={() => handleDisconnect('youtube')}
        />
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Connect your social media accounts to submit clips for campaigns</p>
          <p>• We'll track view counts automatically using platform APIs</p>
          <p>• Earnings are calculated at $1.30 per 1,000 views on average</p>
          <p>• Payouts are processed weekly for verified clips</p>
        </CardContent>
      </Card>
    </div>
  );
}