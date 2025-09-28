import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Instagram, Youtube, Twitter, Twitch, Star, Users, TrendingUp } from "lucide-react";

// Mock data for creator profiles
const creators = [
  {
    id: 1,
    name: "Alex Gaming",
    username: "@alexgaming",
    type: "Streamer",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    followers: 45600,
    rating: 4.9,
    verified: true,
    platforms: ["twitch", "youtube"],
    bio: "Professional gamer and content creator specializing in FPS games"
  },
  {
    id: 2,
    name: "ClipMaster Pro",
    username: "@clipmaster",
    type: "Clipper",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    followers: 23400,
    rating: 4.8,
    verified: true,
    platforms: ["instagram", "tiktok"],
    bio: "Expert clip editor creating viral gaming moments daily"
  },
  {
    id: 3,
    name: "CryptoKing",
    username: "@cryptoking",
    type: "Degen",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    followers: 78900,
    rating: 4.7,
    verified: true,
    platforms: ["twitter", "youtube"],
    bio: "Diamond hands since 2017. Meme coin specialist and market analyst"
  },
  {
    id: 4,
    name: "StreamBoost Agency",
    username: "@streamboost",
    type: "Agency",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    followers: 156000,
    rating: 4.9,
    verified: true,
    platforms: ["instagram", "twitter", "youtube"],
    bio: "Top-tier talent agency representing 50+ content creators"
  },
  {
    id: 5,
    name: "TokenLaunch Labs",
    username: "@tokenlaunch",
    type: "Project",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    followers: 89300,
    rating: 4.6,
    verified: false,
    platforms: ["twitter", "youtube"],
    bio: "Building the future of decentralized gaming platforms"
  },
  {
    id: 6,
    name: "TradeGuru",
    username: "@tradeguru",
    type: "Trader",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    followers: 34700,
    rating: 4.5,
    verified: true,
    platforms: ["twitter", "twitch"],
    bio: "Professional crypto trader sharing daily market insights"
  }
];

const typeColors = {
  Streamer: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Clipper: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Degen: "bg-green-500/10 text-green-500 border-green-500/20",
  Agency: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Project: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  Trader: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
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
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          FRENWORK
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover and connect with top creators in our network
        </p>
        <Badge variant="outline" className="text-lg px-6 py-2">
          Coming Soon
        </Badge>
      </div>

      {/* Creator Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map((creator) => (
          <Card key={creator.id} className="hover-lift transition-all duration-300">
            <CardHeader className="text-center space-y-4">
              <div className="relative mx-auto">
                <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback className="text-xl font-bold">
                    {creator.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {creator.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <CardTitle className="text-xl">{creator.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{creator.username}</p>
                
                {/* Creator Type Badge */}
                <Badge 
                  variant="outline" 
                  className={`${typeColors[creator.type as keyof typeof typeColors]} font-medium`}
                >
                  {creator.type}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Bio */}
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                {creator.bio}
              </p>

              {/* Stats */}
              <div className="flex justify-center items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{creator.followers.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{creator.rating}</span>
                </div>
              </div>

              {/* Platform Icons */}
              <div className="flex justify-center gap-3">
                {creator.platforms.map((platform) => (
                  <div 
                    key={platform}
                    className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <PlatformIcon platform={platform} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming Soon Section */}
      <div className="text-center space-y-4 py-12">
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-2xl font-bold">More Features Coming Soon</h2>
          <p className="text-muted-foreground">
            Advanced filtering, direct messaging, collaboration tools, and much more!
          </p>
        </div>
      </div>
    </div>
  );
}