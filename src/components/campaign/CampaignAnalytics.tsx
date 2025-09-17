import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Award, 
  TrendingUp, 
  Eye, 
  Users, 
  DollarSign, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  FileText,
  BarChart3,
  Target,
  Instagram,
  Youtube,
  User as UserIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { PayoutDashboard } from './PayoutDashboard';

interface CampaignAnalyticsProps {
  campaignId: string;
  onBack: () => void;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  status: string;
  prize_pool: number;
  payout_per_1000_views: number;
  max_payout_per_clip: number;
  start_date: string;
  end_date: string | null;
  auto_approve: boolean;
  participants_count: number;
  total_submissions: number;
}

interface Clip {
  id: string;
  title: string;
  description: string;
  status: string;
  total_views: number;
  earned_amount: number;
  instagram_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  created_at: string;
  approval_date: string | null;
  rejection_reason: string | null;
  user_id: string;
  profiles: {
    display_name: string;
    username: string;
    avatar_url: string;
  } | null;
}

export const CampaignAnalytics = ({ campaignId, onBack }: CampaignAnalyticsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);

  useEffect(() => {
    fetchCampaignData();
  }, [campaignId]);

  const fetchCampaignData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);

      // Fetch campaign details
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .eq('creator_id', user.id)
        .single();

      if (campaignError) throw campaignError;

      // Fetch all clips for this campaign
      const { data: clipsData, error: clipsError } = await supabase
        .from('clips')
        .select(`
          id,
          title,
          description,
          status,
          total_views,
          earned_amount,
          instagram_url,
          youtube_url,
          tiktok_url,
          thumbnail_url,
          video_url,
          created_at,
          approval_date,
          rejection_reason,
          user_id
        `)
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (clipsError) throw clipsError;

      // Fetch profile data for all unique user_ids
      const userIds = [...new Set(clipsData?.map(clip => clip.user_id) || [])];
      let profilesMap: Record<string, { display_name: string; username: string; avatar_url: string }> = {};
      
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, display_name, username, avatar_url')
          .in('user_id', userIds);
        
        if (profilesData) {
          profilesMap = profilesData.reduce((acc, profile) => {
            acc[profile.user_id] = {
              display_name: profile.display_name || 'Unknown User',
              username: profile.username || 'unknown',
              avatar_url: profile.avatar_url || ''
            };
            return acc;
          }, {} as Record<string, { display_name: string; username: string; avatar_url: string }>);
        }
      }

      setCampaign(campaignData);
      setClips((clipsData || []).map(clip => ({
        ...clip,
        profiles: profilesMap[clip.user_id] || null
      })));

    } catch (error) {
      console.error('Error fetching campaign data:', error);
      toast({
        title: "Error",
        description: "Failed to load campaign analytics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClipAction = async (clipId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      const updateData: any = {
        status: action === 'approve' ? 'approved' : 'rejected',
        approval_date: action === 'approve' ? new Date().toISOString() : null,
        rejection_reason: action === 'reject' ? reason : null
      };

      const { error } = await supabase
        .from('clips')
        .update(updateData)
        .eq('id', clipId);

      if (error) throw error;

      await fetchCampaignData();
      setSelectedClip(null);
      setRejectionReason('');

      toast({
        title: action === 'approve' ? "Clip Approved" : "Clip Rejected",
        description: `The clip has been ${action}d successfully.`,
      });

    } catch (error) {
      console.error('Error updating clip:', error);
      toast({
        title: "Error",
        description: `Failed to ${action} clip.`,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary", label: string, icon: React.ReactNode }> = {
      'submitted': { variant: 'outline', label: 'Pending Review', icon: <Clock className="w-3 h-3" /> },
      'approved': { variant: 'default', label: 'Approved', icon: <CheckCircle className="w-3 h-3" /> },
      'rejected': { variant: 'destructive', label: 'Rejected', icon: <XCircle className="w-3 h-3" /> },
    };
    
    const config = variants[status] || { variant: 'outline' as const, label: status, icon: null };
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getPlatformIcon = (clip: Clip) => {
    if (clip.instagram_url) return <Instagram className="w-4 h-4 text-pink-500" />;
    if (clip.youtube_url) return <Youtube className="w-4 h-4 text-red-500" />;
    if (clip.tiktok_url) return <UserIcon className="w-4 h-4 text-black" />;
    return <FileText className="w-4 h-4 text-muted-foreground" />;
  };

  const approvedClips = clips.filter(clip => clip.status === 'approved');
  const pendingClips = clips.filter(clip => clip.status === 'submitted');
  const rejectedClips = clips.filter(clip => clip.status === 'rejected');
  
  const totalViews = approvedClips.reduce((sum, clip) => sum + (clip.total_views || 0), 0);
  const totalEarnings = approvedClips.reduce((sum, clip) => sum + (clip.earned_amount || 0), 0);
  const budgetSpent = totalEarnings;
  const budgetRemaining = (campaign?.prize_pool || 0) - budgetSpent;

  if (loading || !campaign) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Back to Campaigns
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {campaign.title} Analytics
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Overview Block */}
      <Card className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Campaign Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="w-4 h-4" />
                Prize Pool
              </div>
              <div className="text-2xl font-bold">${campaign.prize_pool.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">
                ${budgetSpent.toFixed(2)} spent • ${budgetRemaining.toFixed(2)} remaining
              </div>
              <Progress value={(budgetSpent / campaign.prize_pool) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                Total Views
              </div>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <div className="text-sm text-green-600">
                ${(totalViews * campaign.payout_per_1000_views / 1000).toFixed(2)} potential earnings
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="w-4 h-4" />
                Submissions
              </div>
              <div className="text-2xl font-bold">{clips.length}</div>
              <div className="text-sm text-muted-foreground">
                {approvedClips.length} approved • {pendingClips.length} pending • {rejectedClips.length} rejected
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Campaign Status
              </div>
              <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                {campaign.status}
              </Badge>
              <div className="text-sm text-muted-foreground">
                {campaign.end_date ? `Ends ${format(new Date(campaign.end_date), 'MMM dd, yyyy')}` : 'No end date'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="submissions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="submissions" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Submissions ({clips.length})
          </TabsTrigger>
          <TabsTrigger value="payouts" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Payouts
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Financial
          </TabsTrigger>
        </TabsList>

        {/* Submissions Management */}
        <TabsContent value="submissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Submissions Management</span>
                <Badge variant="outline">
                  Auto-approve: {campaign.auto_approve ? 'Enabled' : 'Disabled'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Creator</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clips.map((clip) => (
                      <TableRow key={clip.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <img 
                              src={clip.profiles?.avatar_url || '/icon-192x192.png'} 
                              alt={clip.profiles?.display_name || 'User'}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <div className="font-medium">{clip.profiles?.display_name || 'Unknown User'}</div>
                              <div className="text-xs text-muted-foreground">@{clip.profiles?.username || 'unknown'}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium truncate">{clip.title}</div>
                            {clip.description && (
                              <div className="text-xs text-muted-foreground truncate">{clip.description}</div>
                            )}
                            {/* Video Links */}
                            <div className="flex gap-2 mt-1">
                              {clip.instagram_url && (
                                <a 
                                  href={clip.instagram_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-pink-100 text-pink-700 rounded hover:bg-pink-200 transition-colors"
                                >
                                  <Instagram className="w-3 h-3" />
                                  Instagram
                                </a>
                              )}
                              {clip.youtube_url && (
                                <a 
                                  href={clip.youtube_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                >
                                  <Youtube className="w-3 h-3" />
                                  YouTube
                                </a>
                              )}
                              {clip.tiktok_url && (
                                <a 
                                  href={clip.tiktok_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                >
                                  <UserIcon className="w-3 h-3" />
                                  TikTok
                                </a>
                              )}
                              {clip.video_url && (
                                <a 
                                  href={clip.video_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                >
                                  <FileText className="w-3 h-3" />
                                  Video
                                </a>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getPlatformIcon(clip)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            {clip.total_views?.toLocaleString() || 0}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(clip.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(clip.created_at), 'MMM dd, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {clip.status === 'submitted' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleClipAction(clip.id, 'approve')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Approve
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => setSelectedClip(clip)}
                                    >
                                      <XCircle className="w-3 h-3 mr-1" />
                                      Reject
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Reject Submission</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="reason">Rejection Reason (Optional)</Label>
                                        <Textarea
                                          id="reason"
                                          placeholder="Explain why this submission is being rejected..."
                                          value={rejectionReason}
                                          onChange={(e) => setRejectionReason(e.target.value)}
                                          rows={3}
                                        />
                                      </div>
                                      <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setSelectedClip(null)}>
                                          Cancel
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          onClick={() => handleClipAction(selectedClip!.id, 'reject', rejectionReason)}
                                        >
                                          Reject Submission
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </>
                            )}
                            {clip.status === 'rejected' && clip.rejection_reason && (
                              <div className="text-xs text-muted-foreground max-w-32 truncate" title={clip.rejection_reason}>
                                Reason: {clip.rejection_reason}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-6">
          <PayoutDashboard campaignId={campaignId} />
        </TabsContent>

        {/* Performance Analytics */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Clips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {approvedClips
                    .sort((a, b) => (b.total_views || 0) - (a.total_views || 0))
                    .slice(0, 5)
                    .map((clip, index) => (
                      <div key={clip.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium truncate">{clip.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {clip.total_views?.toLocaleString()} views • ${clip.earned_amount?.toFixed(2)} earned
                          </div>
                        </div>
                        {getPlatformIcon(clip)}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submission Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Submissions</span>
                    <span className="font-bold">{clips.length}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Approved</span>
                    <span className="font-bold text-green-600">{approvedClips.length}</span>
                  </div>
                  <Progress value={(approvedClips.length / clips.length) * 100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>High Engagement (&gt;1K views)</span>
                    <span className="font-bold text-blue-600">
                      {approvedClips.filter(clip => (clip.total_views || 0) > 1000).length}
                    </span>
                  </div>
                  <Progress 
                    value={(approvedClips.filter(clip => (clip.total_views || 0) > 1000).length / clips.length) * 100} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Breakdown */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Prize Pool</span>
                    <span className="font-bold">${campaign.prize_pool.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spent on Payouts</span>
                    <span className="font-bold text-red-600">${budgetSpent.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining Budget</span>
                    <span className="font-bold text-green-600">${budgetRemaining.toFixed(2)}</span>
                  </div>
                  <Progress value={(budgetSpent / campaign.prize_pool) * 100} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Views Generated</span>
                    <span className="font-bold">{totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost Per 1K Views</span>
                    <span className="font-bold">
                      ${totalViews > 0 ? ((budgetSpent / totalViews) * 1000).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Views Per Dollar</span>
                    <span className="font-bold">
                      {budgetSpent > 0 ? Math.round(totalViews / budgetSpent) : 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};