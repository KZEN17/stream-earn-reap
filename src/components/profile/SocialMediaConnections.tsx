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
      <Card className="h-full transition-all duration-200 hover:shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {icon}
              <CardTitle className="text-xl">{name}</CardTitle>
            </div>
            <div>
              {verified ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              ) : connected ? (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Pending
                </Badge>
              ) : (
                <Badge variant="outline">
                  <XCircle className="w-3 h-3 mr-1" />
                  Not Connected
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {verified && connected ? (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                  ✓ Verified account: @{username}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onDisconnect}
                disabled={loading}
                className="w-full"
              >
                Disconnect Account
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg border-2 border-dashed border-muted">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-1">
                      Verification Required
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Connect and verify your {name} account to participate in campaigns that require {name}.
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={onConnect}
                disabled={loading || isVerifying}
                size="default"
                className="w-full h-10"
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Verify {name} Account
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-3">Social Media Connections</h2>
        <p className="text-lg text-muted-foreground">
          Connect your social media accounts to submit clips and track performance.
        </p>
      </div>

      <Alert className="border-primary/20 bg-primary/5">
        <Shield className="h-5 w-5 text-primary" />
        <AlertDescription className="text-base">
          <strong>Account Verification Required:</strong> To participate in campaigns, you must verify your social media accounts through OAuth. This ensures authentic account ownership and enables automatic view tracking.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <SocialPlatformCard
          platform="instagram"
          icon={<Instagram className="w-6 h-6 text-pink-500" />}
          name="Instagram"
          username={profile?.instagram_username || ''}
          verified={profile?.instagram_verified || false}
          connected={profile?.instagram_connected || false}
          onConnect={() => handleOAuthConnect('instagram')}
          onDisconnect={() => handleDisconnect('instagram')}
        />

        <SocialPlatformCard
          platform="tiktok"
          icon={<Music className="w-6 h-6 text-black dark:text-white" />}
          name="TikTok"
          username={profile?.tiktok_username || ''}
          verified={profile?.tiktok_verified || false}
          connected={profile?.tiktok_connected || false}
          onConnect={() => handleOAuthConnect('tiktok')}
          onDisconnect={() => handleDisconnect('tiktok')}
        />

        <SocialPlatformCard
          platform="youtube"
          icon={<Youtube className="w-6 h-6 text-red-500" />}
          name="YouTube"
          username={profile?.youtube_channel_id || ''}
          verified={profile?.youtube_verified || false}
          connected={profile?.youtube_connected || false}
          onConnect={() => handleOAuthConnect('youtube')}
          onDisconnect={() => handleDisconnect('youtube')}
        />

        <SocialPlatformCard
          platform="twitter"
          icon={<Twitter className="w-6 h-6 text-blue-500" />}
          name="Twitter"
          username={profile?.twitter_username || ''}
          verified={profile?.twitter_verified || false}
          connected={profile?.twitter_connected || false}
          onConnect={() => handleOAuthConnect('twitter')}
          onDisconnect={() => handleDisconnect('twitter')}
        />
      </div>

      <Card className="bg-muted/30 border-muted">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            How it works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-base">
          <p className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center mt-0.5 flex-shrink-0">1</span>
            Connect your social media accounts to submit clips for campaigns
          </p>
          <p className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center mt-0.5 flex-shrink-0">2</span>
            We'll track view counts automatically using platform APIs
          </p>
          <p className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center mt-0.5 flex-shrink-0">3</span>
            Earnings are calculated at $1.30 per 1,000 views on average
          </p>
          <p className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center mt-0.5 flex-shrink-0">4</span>
            Payouts are processed weekly for verified clips
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaConnections;