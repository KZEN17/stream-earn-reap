import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Instagram, Music, Youtube, Twitter, CheckCircle, XCircle, Shield, AlertCircle } from "lucide-react";
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SocialMediaConnections = () => {
  const { profile, loading, fetchProfile } = useUserProfile();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    // Check for verification success from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get('verified');
    if (verified) {
      toast({
        title: "Account Verified!",
        description: `${verified.charAt(0).toUpperCase() + verified.slice(1)} account successfully verified`,
      });
      // Clear URL params and refresh profile
      window.history.replaceState({}, '', window.location.pathname);
      fetchProfile();
    }
  }, []);

  const handleOAuthConnect = async (platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter') => {
    try {
      setVerifying(platform);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('verify-social-account', {
        body: { action: 'auth', platform },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { authUrl } = response.data;
      
      // Open OAuth flow in popup window
      const popup = window.open(
        authUrl, 
        'oauth', 
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      // Monitor popup for completion
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          setVerifying(null);
          // Refresh profile to get updated verification status
          setTimeout(() => {
            fetchProfile();
          }, 1000);
        }
      }, 1000);

    } catch (error) {
      console.error('OAuth connection error:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : `Failed to connect ${platform}`,
        variant: "destructive"
      });
      setVerifying(null);
    }
  };

  const handleDisconnect = async (platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter') => {
    try {
      const updateData: Record<string, any> = {};
      updateData[`${platform}_username`] = null;
      updateData[`${platform}_user_id`] = null;
      updateData[`${platform}_access_token`] = null;
      updateData[`${platform}_verified`] = false;
      updateData[`${platform}_connected`] = false;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Disconnected",
        description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} disconnected successfully`,
      });
      
      fetchProfile();
    } catch (error) {
      toast({
        title: "Disconnection Failed",
        description: error instanceof Error ? error.message : `Failed to disconnect ${platform}`,
        variant: "destructive"
      });
    }
  };

  const SocialPlatformCard = ({ 
    platform, 
    icon, 
    name, 
    username, 
    verified,
    connected, 
    onConnect, 
    onDisconnect 
  }: {
    platform: string;
    icon: React.ReactNode;
    name: string;
    username: string;
    verified: boolean;
    connected: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
  }) => {
    const isVerifying = verifying === platform;

    return (
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            {icon}
            <CardTitle className="text-lg">{name}</CardTitle>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {verified && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
            {connected && !verified ? (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                <AlertCircle className="w-3 h-3 mr-1" />
                Needs Verification
              </Badge>
            ) : !connected ? (
              <Badge variant="outline">
                <XCircle className="w-3 h-3 mr-1" />
                Not Connected
              </Badge>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          {verified && connected ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Verified account: <span className="font-medium">@{username}</span>
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
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Connect and verify your {name} account to participate in campaigns that require {name}.
                </AlertDescription>
              </Alert>
              <Button
                onClick={onConnect}
                disabled={loading || isVerifying}
                size="sm"
                className="w-full"
              >
                {isVerifying ? 'Verifying...' : `Verify ${name} Account`}
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SocialPlatformCard
          platform="instagram"
          icon={<Instagram className="w-5 h-5 text-pink-500" />}
          name="Instagram"
          username={profile?.instagram_username || ''}
          verified={profile?.instagram_verified || false}
          connected={profile?.instagram_connected || false}
          onConnect={() => handleOAuthConnect('instagram')}
          onDisconnect={() => handleDisconnect('instagram')}
        />

        <SocialPlatformCard
          platform="tiktok"
          icon={<Music className="w-5 h-5 text-black dark:text-white" />}
          name="TikTok"
          username={profile?.tiktok_username || ''}
          verified={profile?.tiktok_verified || false}
          connected={profile?.tiktok_connected || false}
          onConnect={() => handleOAuthConnect('tiktok')}
          onDisconnect={() => handleDisconnect('tiktok')}
        />

        <SocialPlatformCard
          platform="youtube"
          icon={<Youtube className="w-5 h-5 text-red-500" />}
          name="YouTube"
          username={profile?.youtube_channel_id || ''}
          verified={profile?.youtube_verified || false}
          connected={profile?.youtube_connected || false}
          onConnect={() => handleOAuthConnect('youtube')}
          onDisconnect={() => handleDisconnect('youtube')}
        />

        <SocialPlatformCard
          platform="twitter"
          icon={<Twitter className="w-5 h-5 text-blue-500" />}
          name="Twitter"
          username={profile?.twitter_username || ''}
          verified={profile?.twitter_verified || false}
          connected={profile?.twitter_connected || false}
          onConnect={() => handleOAuthConnect('twitter')}
          onDisconnect={() => handleDisconnect('twitter')}
        />
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Account Verification Required:</strong> To participate in campaigns, you must verify your social media accounts through OAuth. This ensures authentic account ownership and enables automatic view tracking.
        </AlertDescription>
      </Alert>

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
};

export default SocialMediaConnections;