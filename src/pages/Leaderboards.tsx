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
  
  const activeTab = type || "clippers";

  const mockStreamers = [
    {
      id: 1,
      handle: "@ninja",
      avatar: "/placeholder.svg",
      streamTitle: "VALORANT Ranked Grind",
      viewers: 45000,
      totalEarnings: 8750,
      weeklyEarnings: 2450,
      rank: 1
    },
    {
      id: 2,
      handle: "@shroud",
      avatar: "/placeholder.svg", 
      streamTitle: "CS2 Pro Matches",
      viewers: 38000,
      totalEarnings: 7200,
      weeklyEarnings: 2130,
      rank: 2
    },
    {
      id: 3,
      handle: "@xqc",
      avatar: "/placeholder.svg",
      streamTitle: "Variety Gaming",
      viewers: 52000,
      totalEarnings: 6800,
      weeklyEarnings: 1890,
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
            See who's leading in streaming and clipping rewards
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
          <TabsList className="grid w-full grid-cols-2 lg:w-96 mx-auto">
            <TabsTrigger value="clippers" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Clippers</span>
            </TabsTrigger>
            <TabsTrigger value="streams" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Streams</span>
            </TabsTrigger>
          </TabsList>

          {/* Streams Leaderboard */}
          <TabsContent value="streams" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span>Top Streamers</span>
                  <Badge variant="secondary">{timeFilter === "week" ? "This Week" : "All Time"}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStreamers.map((streamer) => (
                    <div key={streamer.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(streamer.rank)}
                      </div>
                      
                      <div className="w-12 h-12 bg-gradient-primary rounded-full"></div>
                      
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold">{streamer.handle}</h3>
                        <p className="text-sm text-muted-foreground">{streamer.streamTitle}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{(streamer.viewers / 1000).toFixed(0)}K viewers</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Total: </span>
                          <span className="font-medium">${streamer.totalEarnings.toLocaleString()}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Weekly: </span>
                          <span className="font-medium">${streamer.weeklyEarnings.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        View Stream
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          {/* Clippers Rewards */}
          <TabsContent value="clippers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  <span>Top Clippers Rewards</span>
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
                      
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold">{clipper.handle}</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Weekly Points: </span>
                            <span className="font-medium">{clipper.weeklyPoints.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total Points: </span>
                            <span className="font-medium">{clipper.allTimePoints.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Rewards: </span>
                            <span className="font-medium">${(clipper.weeklyPoints * 0.5).toFixed(0)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Rank Bonus: </span>
                            <span className="font-medium">${clipper.rank <= 3 ? (500 - clipper.rank * 150) : 0}</span>
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