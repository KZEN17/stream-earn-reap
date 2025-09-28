import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Instagram, Youtube, Twitter, Twitch, Star, TrendingUp, Users, ArrowRight } from "lucide-react";

// Mock data for trending creators (top section)
const trendingCreators = [
  {
    id: 1,
    name: "chief",
    username: "@0xMarChief117",
    type: "Degen",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    score: 0.82,
    change: 0.26,
    verified: true,
    platforms: ["twitter"]
  },
  {
    id: 2,
    name: "DRAKE",
    username: "@tethmiley", 
    type: "Streamer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    score: 0.31,
    change: 12.89,
    verified: true,
    platforms: ["twitch", "youtube"]
  },
  {
    id: 3,
    name: "CryptoWhale",
    username: "@cryptowhale",
    type: "Trader",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    score: 1.45,
    change: 8.3,
    verified: true,
    platforms: ["twitter"]
  },
  {
    id: 4,
    name: "ViralClips",
    username: "@viralclips",
    type: "Clipper",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    score: 2.1,
    change: 15.7,
    verified: true,
    platforms: ["instagram", "tiktok"]
  },
  {
    id: 5,
    name: "StreamLord", 
    username: "@streamlord",
    type: "Streamer",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    score: 1.89,
    change: 4.2,
    verified: false,
    platforms: ["twitch"]
  },
  {
    id: 6,
    name: "AgencyPro",
    username: "@agencypro",
    type: "Agency",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    score: 3.45,
    change: 22.1,
    verified: true,
    platforms: ["instagram", "youtube"]
  },
  {
    id: 7,
    name: "DegenKing",
    username: "@degenking",
    type: "Degen",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150",
    score: 0.95,
    change: 6.8,
    verified: true,
    platforms: ["twitter"]
  },
  {
    id: 8,
    name: "ProEditor",
    username: "@proeditor",
    type: "Clipper",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    score: 1.67,
    change: 11.4,
    verified: false,
    platforms: ["instagram", "tiktok"]
  },
  {
    id: 9,
    name: "TokenMaster",
    username: "@tokenmaster",
    type: "Project",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    score: 2.8,
    change: 18.9,
    verified: true,
    platforms: ["twitter", "youtube"]
  },
  {
    id: 10,
    name: "TradePro",
    username: "@tradepro",
    type: "Trader",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    score: 1.23,
    change: 9.5,
    verified: true,
    platforms: ["twitter", "twitch"]
  },
  {
    id: 11,
    name: "ClipGenius",
    username: "@clipgenius",
    type: "Clipper",
    avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150",
    score: 1.78,
    change: 13.2,
    verified: false,
    platforms: ["instagram", "youtube"]
  },
  {
    id: 12,
    name: "StreamAgency",
    username: "@streamagency",
    type: "Agency",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150",
    score: 2.34,
    change: 16.8,
    verified: true,
    platforms: ["instagram", "twitter", "youtube"]
  }
];

// Mock data for leaderboard creators
const creators = [
  {
    id: 1,
    name: "AlexGaming",
    username: "@alexgaming",
    type: "Streamer",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    score: 23.05,
    change: 0,
    verified: true,
    platforms: ["twitch", "youtube"],
    rank: 1
  },
  {
    id: 2,
    name: "ClipMaster",
    username: "@clipmaster",
    type: "Clipper", 
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    score: 19.98,
    change: 0,
    verified: true,
    platforms: ["instagram", "tiktok"],
    rank: 2
  },
  {
    id: 3,
    name: "CryptoKing",
    username: "@cryptoking",
    type: "Degen",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    score: 19.36,
    change: 0,
    verified: true,
    platforms: ["twitter", "youtube"],
    rank: 3
  },
  {
    id: 4,
    name: "StreamBoost",
    username: "@streamboost",
    type: "Agency",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    score: 17.11,
    change: 0,
    verified: true,
    platforms: ["instagram", "twitter"],
    rank: 4
  },
  {
    id: 5,
    name: "TokenLabs",
    username: "@tokenlaunch", 
    type: "Project",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    score: 16.67,
    change: 0,
    verified: false,
    platforms: ["twitter", "youtube"],
    rank: 5
  },
  {
    id: 6,
    name: "TradeGuru",
    username: "@tradeguru",
    type: "Trader",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    score: 13.32,
    change: 0,
    verified: true,
    platforms: ["twitter", "twitch"],
    rank: 6
  },
  {
    id: 7,
    name: "GamingPro",
    username: "@gamingpro",
    type: "Streamer",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150",
    score: 13.04,
    change: 0,
    verified: true,
    platforms: ["twitch"],
    rank: 7
  },
  {
    id: 8,
    name: "EditMaster",
    username: "@editmaster",
    type: "Clipper",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    score: 12.95,
    change: 0,
    verified: false,
    platforms: ["instagram", "tiktok"],
    rank: 8
  },
  {
    id: 9,
    name: "DegenLord",
    username: "@degenlord",
    type: "Degen",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    score: 12.12,
    change: 0,
    verified: true,
    platforms: ["twitter"],
    rank: 9
  },
  {
    id: 10,
    name: "ProClips",
    username: "@proclips",
    type: "Agency",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    score: 11.57,
    change: 0,
    verified: false,
    platforms: ["instagram", "youtube"],
    rank: 10
  },
  {
    id: 11,
    name: "TokenBuilder",
    username: "@tokenbuilder",
    type: "Project",
    avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150",
    score: 10.89,
    change: 0,
    verified: true,
    platforms: ["twitter", "youtube"],
    rank: 11
  },
  {
    id: 12,
    name: "CryptoTrader",
    username: "@cryptotrader",
    type: "Trader",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150",
    score: 10.45,
    change: 0,
    verified: true,
    platforms: ["twitter", "twitch"],
    rank: 12
  }
];

const featuredCreators = [
  {
    name: "GameMaster",
    username: "@gamemaster",
    score: 0.95,
    change: 7.42,
    changePercent: true,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
  },
  {
    name: "ClipLord",
    username: "@cliplord",
    score: 0.67,
    change: 5.21,
    changePercent: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
  }
];

const typeColors = {
  Streamer: "text-purple-400",
  Clipper: "text-blue-400", 
  Degen: "text-green-400",
  Agency: "text-orange-400",
  Project: "text-pink-400",
  Trader: "text-yellow-400"
};

const PlatformIcon = ({ platform }: { platform: string }) => {
  const iconClass = "w-4 h-4";
  switch (platform) {
    case "instagram": return <Instagram className={iconClass} />;
    case "youtube": return <Youtube className={iconClass} />;
    case "twitter": return <Twitter className={iconClass} />;
    case "twitch": return <Twitch className={iconClass} />;
    default: return null;
  }
};

export default function CreatorProfiles() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            FRENWORK
          </h1>
          <p className="text-muted-foreground">
            Top creators in our network - ranked by performance
          </p>
        </div>

        {/* Trending Section - Top 12 Profile Cards */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Trending</h2>
            <Badge variant="outline" className="text-sm">
              Most popular creators right now
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {trendingCreators.map((creator) => (
              <Card key={creator.id} className="bg-card/50 border-border/50 hover:bg-card/70 transition-all group">
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className="relative mx-auto w-fit">
                      <Avatar className="w-16 h-16 ring-2 ring-primary/20">
                        <AvatarImage src={creator.avatar} alt={creator.name} />
                        <AvatarFallback>{creator.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      {creator.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                          <Star className="w-3 h-3 text-white fill-white" />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-sm truncate">{creator.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{creator.username}</p>
                      <Badge variant="outline" className={`text-xs mt-2 ${typeColors[creator.type as keyof typeof typeColors]} border-current`}>
                        {creator.type}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <TrendingUp className="w-3 h-3 text-red-500" />
                        <span className="font-bold text-sm">{creator.score}</span>
                      </div>
                      <div className="text-green-500 text-xs">
                        ▲ {creator.change}%
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                        Follow
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Leaderboard</h2>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-3 space-y-2">
            {creators.map((creator) => (
              <Card key={creator.id} className="bg-card/50 border-border/50 hover:bg-card/70 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={creator.avatar} alt={creator.name} />
                          <AvatarFallback>{creator.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        {creator.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                            <Star className="w-2 h-2 text-white fill-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{creator.name}</h3>
                          <Badge variant="outline" className={`text-xs ${typeColors[creator.type as keyof typeof typeColors]} border-current`}>
                            {creator.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{creator.username}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-red-500" />
                        <span className="font-bold text-lg">{creator.score}</span>
                      </div>
                      <div className="text-green-500 text-sm">
                        {creator.change}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Section */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Top Performers</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Highest scoring creators this week
                </p>
                
                <div className="space-y-4">
                  {featuredCreators.map((creator, index) => (
                    <div key={index} className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={creator.avatar} alt={creator.name} />
                          <AvatarFallback>{creator.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{creator.name}</p>
                          <p className="text-xs text-muted-foreground">{creator.username}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-red-500" />
                          <span className="font-bold">{creator.score}</span>
                        </div>
                        <div className="text-green-500 text-sm">
                          ▲ {creator.change}%
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full" size="sm">
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Coming Soon */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-bold mb-2">More Features</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Advanced analytics, creator tools, and collaboration features coming soon!
                </p>
                <Badge variant="outline">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}