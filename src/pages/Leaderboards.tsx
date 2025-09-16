import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  TrendingUp, 
  Eye, 
  ThumbsUp, 
  Clock,
  Crown,
  Medal,
  Award,
  DollarSign
} from "lucide-react";

const Leaderboards = () => {
  const { type } = useParams();
  const [timeFilter, setTimeFilter] = useState("week");
  
  const activeTab = type || "clips";

  const mockClips = [
    {
      id: 1,
      title: "Epic 1v5 Clutch Victory",
      thumbnail: "/placeholder.svg",
      streamer: "@ninja",
      views: 125000,
      upvotes: 2400,
      rank: 1
    },
    {
      id: 2,
      title: "Insane No-Scope Headshot",
      thumbnail: "/placeholder.svg", 
      streamer: "@shroud",
      views: 98000,
      upvotes: 1800,
      rank: 2
    },
    {
      id: 3,
      title: "200 IQ Strategic Play",
      thumbnail: "/placeholder.svg",
      streamer: "@xqc",
      views: 87000,
      upvotes: 1650,
      rank: 3
    }
  ];

  const mockClippers = [
    {
      id: 1,
      handle: "@clipmaster",
      avatar: "/placeholder.svg",
      weeklyPoints: 2450,
      allTimePoints: 15600,
      rank: 1
    },
    {
      id: 2,
      handle: "@viralking", 
      avatar: "/placeholder.svg",
      weeklyPoints: 2130,
      allTimePoints: 12400,
      rank: 2
    },
    {
      id: 3,
      handle: "@contentcreator",
      avatar: "/placeholder.svg",
      weeklyPoints: 1890,
      allTimePoints: 11200,
      rank: 3
    }
  ];

  const mockFees = [
    {
      id: 1,
      handle: "@pumpstreamer",
      avatar: "/placeholder.svg",
      feesUSD: 1250,
      toStreamsUSD: 625,
      toTalentUSD: 375,
      toAudienceUSD: 250,
      rank: 1
    },
    {
      id: 2,
      handle: "@cryptoking",
      avatar: "/placeholder.svg", 
      feesUSD: 980,
      toStreamsUSD: 490,
      toTalentUSD: 294,
      toAudienceUSD: 196,
      rank: 2
    },
    {
      id: 3,
      handle: "@tokenmaster",
      avatar: "/placeholder.svg",
      feesUSD: 750,
      toStreamsUSD: 375,
      toTalentUSD: 225,
      toAudienceUSD: 150,
      rank: 3
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 text-center text-sm font-bold">{rank}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-gradient-rainbow">Leaderboards</h1>
          <p className="text-xl text-muted-foreground">
            See who's dominating the clip economy
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex justify-center">
          <div className="flex space-x-2 bg-muted rounded-lg p-1">
            <Button
              variant={timeFilter === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeFilter("week")}
            >
              This Week
            </Button>
            <Button
              variant={timeFilter === "alltime" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeFilter("alltime")}
            >
              All Time
            </Button>
          </div>
        </div>

        {/* Leaderboard Tabs */}
        <Tabs value={activeTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-96 mx-auto">
            <TabsTrigger value="clips" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Clips</span>
            </TabsTrigger>
            <TabsTrigger value="clippers" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Clippers</span>
            </TabsTrigger>
            <TabsTrigger value="fees" className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Fees</span>
            </TabsTrigger>
          </TabsList>

          {/* Clips Leaderboard */}
          <TabsContent value="clips" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span>Top Clips</span>
                  <Badge variant="secondary">{timeFilter === "week" ? "This Week" : "All Time"}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockClips.map((clip) => (
                    <div key={clip.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(clip.rank)}
                      </div>
                      
                      <div className="w-16 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold">{clip.title}</h3>
                        <p className="text-sm text-muted-foreground">{clip.streamer}</p>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          <span>{(clip.views / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                          <span>{(clip.upvotes / 1000).toFixed(1)}K</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        View Clip
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clippers Leaderboard */}
          <TabsContent value="clippers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  <span>Top Clippers</span>
                  <Badge variant="secondary">{timeFilter === "week" ? "This Week" : "All Time"}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockClippers.map((clipper) => (
                    <div key={clipper.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(clipper.rank)}
                      </div>
                      
                      <div className="w-12 h-12 bg-gradient-secondary rounded-full"></div>
                      
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold">{clipper.handle}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Weekly: {clipper.weeklyPoints.toLocaleString()} pts</span>
                          <span>All-time: {clipper.allTimePoints.toLocaleString()} pts</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fees Leaderboard */}
          <TabsContent value="fees" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-accent" />
                  <span>Top Fee Earners</span>
                  <Badge variant="secondary">{timeFilter === "week" ? "This Week" : "All Time"}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFees.map((fee) => (
                    <div key={fee.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(fee.rank)}
                      </div>
                      
                      <div className="w-12 h-12 bg-gradient-accent rounded-full"></div>
                      
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold">{fee.handle}</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Total: </span>
                            <span className="font-medium">${fee.feesUSD}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Streams: </span>
                            <span className="font-medium">${fee.toStreamsUSD}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Talent: </span>
                            <span className="font-medium">${fee.toTalentUSD}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Audience: </span>
                            <span className="font-medium">${fee.toAudienceUSD}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboards;