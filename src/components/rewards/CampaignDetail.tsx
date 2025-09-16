import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';
import { 
  Award, 
  Clock, 
  Users, 
  Target,
  CheckCircle,
  TrendingUp,
  ArrowLeft,
  Instagram,
  Youtube,
  User as TikTokIcon,
  Eye,
  DollarSign,
  Play
} from "lucide-react";

interface CampaignDetailProps {
  campaignId: string;
  onBack: () => void;
  onJoin: (campaignId: string) => void;
}

interface Submission {
  id: string;
  title: string;
  user_id: string;
  status: string;
  total_views: number;
  earned_amount: number;
  instagram_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  created_at: string;
}

interface CampaignDetailProps {
  campaignId: string;
  onBack: () => void;
  onJoin: (campaignId: string) => void;
}

// Mock campaign detail data
const getCampaignDetail = (id: string) => ({
  id,
  title: "Holiday Crypto Clips Challenge",
  description: "Create viral clips featuring holiday-themed crypto content from top streamers. Focus on pump.fun launches, trading reactions, and festive crypto moments.",
  rewardPool: 5000,
  pointsPerClip: 100,
  bonusMultiplier: 2,
  participants: 89,
  maxParticipants: 200,
  deadline: "Dec 31, 2024",
  startDate: "Dec 1, 2024",
  status: 'active' as const,
  requirements: [
    "Clip must be 15-60 seconds long",
    "Must include holiday or festive elements",
    "Source must be from approved streamers list",
    "Original audio required (no music overlay)",
    "Minimum 720p quality"
  ],
  rewards: [
    { rank: "1st Place", amount: 1000, description: "Most viral clip" },
    { rank: "2nd Place", amount: 750, description: "Second most engagement" },
    { rank: "3rd Place", amount: 500, description: "Third highest views" },
    { rank: "Top 10", amount: 200, description: "Per clip in top 10" },
    { rank: "Participation", amount: 50, description: "For approved submissions" }
  ],
  rules: [
    "All clips must be original content",
    "No copyrighted music or content",
    "Must follow platform guidelines",
    "One submission per 24 hours",
    "Voting manipulation will result in disqualification"
  ],
  tags: ["Holiday", "Crypto", "Viral", "Bonus"],
  leaderboard: [
    { rank: 1, clipper: "CryptoClipKing", clips: 12, points: 2400, views: 45000 },
    { rank: 2, clipper: "ViralMoments", clips: 8, points: 1800, views: 32000 },
    { rank: 3, clipper: "ClipMaster2024", clips: 6, points: 1200, views: 28000 }
  ]
});

export const CampaignDetail = ({ campaignId, onBack, onJoin }: CampaignDetailProps) => {
  const [campaign, setCampaign] = useState<any>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaignData();
  }, [campaignId]);

  const fetchCampaignData = async () => {
    try {
      // Fetch campaign data
      const { data: campaignData } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      // Fetch submissions for this campaign
      const { data: submissionsData } = await supabase
        .from('clips')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      setCampaign(campaignData);
      setSubmissions(submissionsData || []);
    } catch (error) {
      console.error('Error fetching campaign data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (submission: Submission) => {
    if (submission.instagram_url) return <Instagram className="w-4 h-4 text-pink-500" />;
    if (submission.youtube_url) return <Youtube className="w-4 h-4 text-red-500" />;
    if (submission.tiktok_url) return <TikTokIcon className="w-4 h-4 text-black" />;
    return <Play className="w-4 h-4 text-muted-foreground" />;
  };

  const getPlatformUrl = (submission: Submission) => {
    return submission.instagram_url || submission.youtube_url || submission.tiktok_url || '#';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary", label: string }> = {
      'submitted': { variant: 'outline', label: 'Submitted' },
      'approved': { variant: 'default', label: 'Approved' },
      'rejected': { variant: 'destructive', label: 'Rejected' },
      'pending': { variant: 'outline', label: 'Pending' },
    };
    
    const config = variants[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading || !campaign) {
    return <div className="flex justify-center p-8">Loading campaign details...</div>;
  }

  const totalEarned = submissions.reduce((sum, sub) => sum + (sub.earned_amount || 0), 0);
  const totalViews = submissions.reduce((sum, sub) => sum + (sub.total_views || 0), 0);
  const progressPercentage = campaign.prize_pool > 0 ? Math.min((totalEarned / campaign.prize_pool) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Campaigns
        </Button>
      </div>

      {/* Campaign Overview - New Compact Design */}
      <Card className="bg-card border border-border rounded-xl p-6">
        <CardContent className="p-0 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">
                {campaign.title}
              </h1>
            </div>
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm font-medium">
              ${campaign.payout_per_1000_views} / 1000
            </Badge>
          </div>

          {/* Subtitle */}
          <div>
            <p className="text-muted-foreground">
              {campaign.title} (Earn ${campaign.payout_per_1000_views} per 1,000 Views)
            </p>
          </div>

          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-foreground">
                ${totalEarned.toFixed(2)} of ${campaign.prize_pool} paid out
              </span>
              <span className="text-lg font-bold text-foreground">
                {progressPercentage.toFixed(0)}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-6">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Type:</span> Clipping
              </div>
              
              {/* Platform Icons */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-pink-600 rounded flex items-center justify-center">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
                <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                  <TikTokIcon className="w-4 h-4 text-white" />
                </div>
                <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                  <Youtube className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Views:</span> {totalViews.toLocaleString()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button size="lg" onClick={() => onJoin(campaign.id)} className="bg-gradient-primary">
              <Target className="w-5 h-5 mr-2" />
              Join Campaign
            </Button>
            <Button variant="outline" size="lg">
              <Play className="w-5 h-5 mr-2" />
              Submit Clip
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="submissions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="submissions">Submissions ({submissions.length})</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Submissions Tab */}
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" />
                Campaign Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-8">
                  <Play className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No submissions yet</p>
                  <Button className="mt-4" onClick={() => onJoin(campaign.id)}>
                    Be the First to Submit
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Clip Title</TableHead>
                        <TableHead>Creator</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Earned</TableHead>
                        <TableHead>Submitted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">
                            <a 
                              href={getPlatformUrl(submission)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-primary transition-colors"
                            >
                              {submission.title}
                            </a>
                          </TableCell>
                          <TableCell>
                            Anonymous User
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(submission.status)}
                          </TableCell>
                          <TableCell>
                            <a 
                              href={getPlatformUrl(submission)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center hover:opacity-80"
                            >
                              {getPlatformIcon(submission)}
                            </a>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4 text-muted-foreground" />
                              {submission.total_views?.toLocaleString() || 0}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              ${submission.earned_amount?.toFixed(2) || '0.00'}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(submission.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requirements Tab */}
        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Campaign Requirements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">General Requirements:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Clip must be between 15-60 seconds long</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Must be original content from approved streamers</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Minimum 720p video quality required</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">No copyrighted music or content</span>
                    </li>
                  </ul>
                </div>
                
                {campaign.campaign_rules && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Campaign Specific Rules:</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {campaign.campaign_rules}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Top Performers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No submissions to rank yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions
                    .sort((a, b) => (b.total_views || 0) - (a.total_views || 0))
                    .slice(0, 10)
                    .map((submission, index) => (
                      <div key={submission.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">Anonymous User</div>
                            <div className="text-sm text-muted-foreground">
                              {submission.title}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{submission.total_views?.toLocaleString() || 0}</div>
                          <div className="text-xs text-muted-foreground">views</div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};