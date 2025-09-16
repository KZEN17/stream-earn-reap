import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Medal, Award, Users, TrendingUp, DollarSign, Eye, Play, Trophy } from "lucide-react";
import { useLeaderboards } from "@/hooks/useLeaderboards";
import { Skeleton } from "@/components/ui/skeleton";

const Leaderboards = () => {
  const { type } = useParams();
  const [timeFilter, setTimeFilter] = useState<'week' | 'all-time'>('week');
  const { streamers, clippers, loading, error } = useLeaderboards(timeFilter);

  const activeTab = type || "clippers";

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
              variant={timeFilter === "all-time" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeFilter("all-time")}
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
              <Users className="w-4 h-4" />
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
                    {loading ? (
                      Array(5).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))
                    ) : streamers.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No streamers data available</p>
                      </div>
                    ) : (
                      streamers.map((streamer) => (
                        <div
                          key={streamer.id}
                          className="flex items-center gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="flex-shrink-0">
                              {getRankIcon(streamer.rank_position)}
                            </div>
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarImage src={streamer.avatar_url} />
                              <AvatarFallback>{streamer.display_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">@{streamer.username}</p>
                              <p className="text-sm text-muted-foreground">
                                {(timeFilter === 'week' ? streamer.views_this_week : streamer.total_views).toLocaleString()} views
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <div className="text-center">
                              <div className="flex items-center gap-1 text-green-600">
                                <DollarSign className="w-4 h-4" />
                                ${(timeFilter === 'week' ? streamer.earnings_this_week : streamer.total_earnings).toLocaleString()}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
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
                    {loading ? (
                      Array(5).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))
                    ) : clippers.length === 0 ? (
                      <div className="text-center py-8">
                        <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No clippers data available</p>
                      </div>
                    ) : (
                      clippers.map((clipper) => (
                        <div
                          key={clipper.id}
                          className="flex items-center gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="flex-shrink-0">
                              {getRankIcon(clipper.rank_position)}
                            </div>
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarImage src={clipper.avatar_url} />
                              <AvatarFallback>{clipper.display_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">@{clipper.username}</p>
                              <p className="text-sm text-muted-foreground">
                                {clipper.total_clips} clips
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <div className="text-center">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Eye className="w-4 h-4" />
                                {(timeFilter === 'week' ? clipper.views_this_week : clipper.total_views).toLocaleString()}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center gap-1 text-green-600">
                                <DollarSign className="w-4 h-4" />
                                ${(timeFilter === 'week' ? clipper.earnings_this_week : clipper.total_earnings).toLocaleString()}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
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