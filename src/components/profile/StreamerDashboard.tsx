import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Rocket, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Play,
  ExternalLink,
  Plus,
  Eye,
  Clock
} from 'lucide-react';

export const StreamerDashboard = () => {
  // Mock data - replace with real data from hooks
  const stats = {
    totalLaunches: 3,
    totalFollowers: 12500,
    totalEarnings: 8450.00,
    communityGrowth: 2300,
    nextLaunch: "2024-12-25T19:00:00Z"
  };

  const launches = [
    {
      id: 1,
      title: "$MOON Token Launch",
      tokenSymbol: "MOON",
      date: "2024-12-20T19:00:00Z",
      status: "completed",
      raised: 125000,
      views: 45000,
      participants: 1200,
      clips: 23,
      thumbnail: "/placeholder.svg"
    },
    {
      id: 2,
      title: "$ROCKET Christmas Special", 
      tokenSymbol: "ROCKET",
      date: "2024-12-25T19:00:00Z",
      status: "scheduled",
      raised: 0,
      views: 0,
      participants: 0,
      clips: 0,
      thumbnail: "/placeholder.svg"
    }
  ];

  const streams = [
    {
      id: 1,
      title: "Building the Next Big Token",
      platform: "Twitch",
      date: "2024-12-18T20:00:00Z",
      viewers: 1200,
      duration: "3h 24m",
      status: "completed"
    },
    {
      id: 2,
      title: "Community AMA - Token Launch Q&A",
      platform: "YouTube",
      date: "2024-12-17T18:00:00Z", 
      viewers: 890,
      duration: "1h 45m",
      status: "completed"
    }
  ];

  const community = [
    {
      platform: "Twitch",
      followers: 5200,
      growth: "+340 this week"
    },
    {
      platform: "Twitter",
      followers: 4500,
      growth: "+280 this week"
    },
    {
      platform: "YouTube",
      followers: 2800,
      growth: "+120 this week"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'scheduled': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'live': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-primary" />
              <div>
                <p className="text-2xl font-bold text-primary">{stats.totalLaunches}</p>
                <p className="text-xs text-muted-foreground">Token Launches</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-500">{(stats.totalFollowers / 1000).toFixed(1)}K</p>
                <p className="text-xs text-muted-foreground">Total Followers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-500">${(stats.totalEarnings / 1000).toFixed(1)}K</p>
                <p className="text-xs text-muted-foreground">Total Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <div>
                <p className="text-2xl font-bold text-accent">+{stats.communityGrowth}</p>
                <p className="text-xs text-muted-foreground">Growth This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="launches" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="launches">Launches</TabsTrigger>
          <TabsTrigger value="streams">Streams</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="launches" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Token Launches</h3>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              <Plus className="w-4 h-4 mr-2" />
              Create Launch
            </Button>
          </div>
          
          <div className="grid gap-4">
            {launches.map((launch) => (
              <Card key={launch.id} className="hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={launch.thumbnail} />
                      <AvatarFallback>{launch.tokenSymbol}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{launch.title}</h4>
                        <Badge variant="outline" className={getStatusColor(launch.status)}>
                          {launch.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <p className="font-medium">{formatDate(launch.date)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Raised:</span>
                          <p className="font-medium">${launch.raised.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Views:</span>
                          <p className="font-medium">{launch.views.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Clips:</span>
                          <p className="font-medium">{launch.clips}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        {launch.status === 'scheduled' ? (
                          <Button size="sm" variant="outline">
                            <Calendar className="w-3 h-3 mr-1" />
                            Manage Launch
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            View Results
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="streams" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Streams</h3>
            <Button variant="outline" size="sm">
              <Play className="w-4 h-4 mr-2" />
              Go Live
            </Button>
          </div>
          
          <div className="space-y-3">
            {streams.map((stream) => (
              <Card key={stream.id} className="hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{stream.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{stream.platform}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(stream.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {stream.viewers} viewers
                        </span>
                        <span>{stream.duration}</span>
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

        <TabsContent value="community" className="space-y-4">
          <h3 className="text-lg font-semibold">Community Growth</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            {community.map((platform, index) => (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <h4 className="font-semibold mb-2">{platform.platform}</h4>
                  <p className="text-2xl font-bold mb-1">{(platform.followers / 1000).toFixed(1)}K</p>
                  <p className="text-sm text-green-600">{platform.growth}</p>
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
                  <DollarSign className="w-5 h-5 text-green-500" />
                  Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Token Launches:</span>
                  <span className="font-bold text-green-500">$6,200</span>
                </div>
                <div className="flex justify-between">
                  <span>Stream Donations:</span>
                  <span className="font-bold">$1,450</span>
                </div>
                <div className="flex justify-between">
                  <span>Clip Earnings:</span>
                  <span className="font-bold">$800</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-green-500">${stats.totalEarnings.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Avg Launch Success:</span>
                  <span className="font-bold text-green-500">94%</span>
                </div>
                <div className="flex justify-between">
                  <span>Community Retention:</span>
                  <span className="font-bold">87%</span>
                </div>
                <div className="flex justify-between">
                  <span>Clip Conversion:</span>
                  <span className="font-bold">23%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};