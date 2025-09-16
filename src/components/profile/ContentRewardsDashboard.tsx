import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Target, DollarSign, Eye, Calendar, ExternalLink, Instagram, Youtube, User as UserIcon } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface Campaign {
  id: string;
  title: string;
  status: string;
  prize_pool: number;
  payout_per_1000_views: number;
  participants_count: number;
  total_submissions: number;
  created_at: string;
  end_date: string | null;
  clips?: { count: number }[];
  submission_count?: number;
}

interface Clip {
  id: string;
  title: string;
  status: string;
  total_views: number;
  earned_amount: number;
  instagram_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  created_at: string;
  campaign: {
    title: string;
    payout_per_1000_views: number;
  };
}

export const ContentRewardsDashboard = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);

      // Fetch campaigns created by user
      const { data: campaignsData } = await supabase
        .from('campaigns')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      // For each campaign, count the submissions
      const campaignsWithCounts = await Promise.all(
        (campaignsData || []).map(async (campaign) => {
          const { count: submissionCount } = await supabase
            .from('clips')
            .select('*', { count: 'exact', head: true })
            .eq('campaign_id', campaign.id);
          
          return {
            ...campaign,
            submission_count: submissionCount || 0
          };
        })
      );

      // Fetch clips submitted by user
      const { data: clipsData } = await supabase
        .from('clips')
        .select(`
          *,
          campaign:campaigns(title, payout_per_1000_views)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setCampaigns(campaignsWithCounts);
      setClips(clipsData || []);

      // Calculate totals
      const earnings = clipsData?.reduce((sum, clip) => sum + (clip.earned_amount || 0), 0) || 0;
      const views = clipsData?.reduce((sum, clip) => sum + (clip.total_views || 0), 0) || 0;
      
      setTotalEarnings(earnings);
      setTotalViews(views);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary", label: string }> = {
      'active': { variant: 'default', label: 'Active' },
      'pending': { variant: 'outline', label: 'Pending' },
      'approved': { variant: 'default', label: 'Approved' },
      'rejected': { variant: 'destructive', label: 'Rejected' },
      'completed': { variant: 'secondary', label: 'Completed' },
      'submitted': { variant: 'outline', label: 'Submitted' },
    };
    
    const config = variants[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPlatformIcon = (clip: Clip) => {
    if (clip.instagram_url) return <Instagram className="w-4 h-4 text-pink-500" />;
    if (clip.youtube_url) return <Youtube className="w-4 h-4 text-red-500" />;
    if (clip.tiktok_url) return <UserIcon className="w-4 h-4 text-black" />;
    return <ExternalLink className="w-4 h-4 text-muted-foreground" />;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Content Rewards Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{campaigns.length}</div>
            <div className="text-sm text-muted-foreground">Campaigns Created</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{clips.length}</div>
            <div className="text-sm text-muted-foreground">Clips Submitted</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">${totalEarnings.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Total Earnings</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{totalViews.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </div>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              My Campaigns ({campaigns.length})
            </TabsTrigger>
            <TabsTrigger value="submissions" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              My Submissions ({clips.length})
            </TabsTrigger>
          </TabsList>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns">
            {campaigns.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No campaigns created yet</p>
                <Button className="mt-4" onClick={() => window.location.href = '/create-campaign'}>
                  Create Your First Campaign
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prize Pool</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Submissions</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.title}</TableCell>
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                        <TableCell>${campaign.prize_pool}</TableCell>
                        <TableCell>{campaign.participants_count || 0}</TableCell>
                        <TableCell>{campaign.submission_count || campaign.total_submissions || 0}</TableCell>
                        <TableCell>{new Date(campaign.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions">
            {clips.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No clips submitted yet</p>
                <Button className="mt-4" onClick={() => window.location.href = '/rewards'}>
                  Browse Active Campaigns
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total Views</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Reward Rate</TableHead>
                      <TableHead>Earned</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clips.map((clip) => (
                      <TableRow key={clip.id}>
                        <TableCell className="font-medium">{clip.title}</TableCell>
                        <TableCell>{getStatusBadge(clip.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            {clip.total_views?.toLocaleString() || 0}
                          </div>
                        </TableCell>
                        <TableCell>{getPlatformIcon(clip)}</TableCell>
                        <TableCell>
                          ${clip.campaign?.payout_per_1000_views || 0} / 1000 views
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            ${clip.earned_amount?.toFixed(2) || '0.00'}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};