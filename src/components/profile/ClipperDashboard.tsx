import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Video, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  Play,
  ExternalLink,
  Trophy,
  Target,
  Clock
} from 'lucide-react';

export const ClipperDashboard = () => {
  // Mock data - replace with real data from hooks
  const stats = {
    totalEarnings: 1247.50,
    totalViews: 125000,
    totalClips: 23,
    weeklyEarnings: 245.80,
    weeklyViews: 18500,
    weeklyClips: 4,
    rank: 12
  };

  const missions = [
    {
      id: 1,
      title: "$MOON Launch Clips",
      description: "Create viral clips from the Moon Master launch stream",
      reward: "$50 per 1K views",
      deadline: "2 days left",
      progress: 75,
      status: "active"
    },
    {
      id: 2,
      title: "Gaming Highlights",
      description: "Best gaming moments from featured streamers",
      reward: "$30 per 1K views",
      deadline: "5 days left",
      progress: 30,
      status: "active"
    }
  ];

  const recentClips = [
    {
      id: 1,
      title: "Epic $MOON Launch Moment",
      campaign: "$MOON Campaign",
      views: 12500,
      earnings: 62.50,
      status: "approved",
      platform: "TikTok",
      submittedAt: "2 hours ago"
    },
    {
      id: 2,
      title: "Streamer Reaction Compilation",
      campaign: "Gaming Highlights",
      views: 8200,
      earnings: 24.60,
      status: "pending",
      platform: "Instagram",
      submittedAt: "1 day ago"
    },
    {
      id: 3,
      title: "Token Launch Hype",
      campaign: "$MOON Campaign",
      views: 15600,
      earnings: 78.00,
      status: "approved",
      platform: "YouTube",
      submittedAt: "3 days ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-500">${stats.totalEarnings}</p>
                <p className="text-xs text-muted-foreground">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-500">{(stats.totalViews / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-purple-500">{stats.totalClips}</p>
                <p className="text-xs text-muted-foreground">Total Clips</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-accent" />
              <div>
                <p className="text-2xl font-bold text-accent">#{stats.rank}</p>
                <p className="text-xs text-muted-foreground">Leaderboard</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="missions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="missions">Active Missions</TabsTrigger>
          <TabsTrigger value="clips">My Clips</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="missions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Available Missions</h3>
            <Button variant="outline" size="sm">
              <Target className="w-4 h-4 mr-2" />
              Browse All
            </Button>
          </div>
          
          <div className="grid gap-4">
            {missions.map((mission) => (
              <Card key={mission.id} className="hover-lift">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{mission.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {mission.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                      {mission.reward}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {mission.deadline}
                    </span>
                    <span>{mission.progress}% Complete</span>
                  </div>
                  <Progress value={mission.progress} className="h-2" />
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Play className="w-3 h-3 mr-1" />
                      Start Clipping
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="clips" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Submissions</h3>
            <Button variant="outline" size="sm">
              <Video className="w-4 h-4 mr-2" />
              Upload Clip
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentClips.map((clip) => (
              <Card key={clip.id} className="hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{clip.title}</h4>
                        <Badge variant="outline" className={getStatusColor(clip.status)}>
                          {clip.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{clip.campaign}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {clip.views.toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          ${clip.earnings.toFixed(2)}
                        </span>
                        <span>{clip.platform}</span>
                        <span>{clip.submittedAt}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Earnings:</span>
                  <span className="font-bold text-green-500">${stats.weeklyEarnings}</span>
                </div>
                <div className="flex justify-between">
                  <span>Views:</span>
                  <span className="font-bold">{stats.weeklyViews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Clips:</span>
                  <span className="font-bold">{stats.weeklyClips}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  All Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Earnings:</span>
                  <span className="font-bold text-green-500">${stats.totalEarnings}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Views:</span>
                  <span className="font-bold">{stats.totalViews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate:</span>
                  <span className="font-bold text-green-500">87%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};