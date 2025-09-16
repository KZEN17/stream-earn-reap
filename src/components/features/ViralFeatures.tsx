import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Users, 
  Zap, 
  Target, 
  Award,
  Bell,
  Crown,
  Flame,
  Heart
} from "lucide-react";
import { toast } from "sonner";

export const RaidBadges = () => {
  const [collectedBadges, setCollectedBadges] = useState<string[]>(["rookie", "supporter"]);

  const badges = [
    {
      id: "rookie",
      name: "Raid Rookie",
      description: "Participated in your first raid",
      icon: Star,
      rarity: "common",
      color: "text-green-500"
    },
    {
      id: "supporter", 
      name: "Token Supporter",
      description: "Supported 5+ token launches",
      icon: Heart,
      rarity: "common", 
      color: "text-blue-500"
    },
    {
      id: "commander",
      name: "Raid Commander", 
      description: "Led 10 successful raids",
      icon: Crown,
      rarity: "rare",
      color: "text-purple-500"
    },
    {
      id: "legend",
      name: "Raid Legend",
      description: "Participated in 100+ raids",
      icon: Trophy,
      rarity: "legendary",
      color: "text-yellow-500"
    }
  ];

  const getRarityBadge = (rarity: string) => {
    const config = {
      common: { variant: "secondary" as const, label: "Common" },
      rare: { variant: "default" as const, label: "Rare" },
      legendary: { variant: "destructive" as const, label: "Legendary" }
    };
    const rarityConfig = config[rarity as keyof typeof config] || config.common;
    return <Badge variant={rarityConfig.variant}>{rarityConfig.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="w-5 h-5 mr-2 text-primary" />
          Raid Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge) => {
            const IconComponent = badge.icon;
            const isCollected = collectedBadges.includes(badge.id);
            
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border ${
                  isCollected 
                    ? 'border-primary/50 bg-primary/5' 
                    : 'border-muted bg-muted/20 opacity-60'
                }`}
              >
                <div className="text-center space-y-2">
                  <IconComponent className={`w-8 h-8 mx-auto ${badge.color}`} />
                  <div>
                    <h4 className="font-medium text-sm">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                  {getRarityBadge(badge.rarity)}
                  {!isCollected && (
                    <div className="text-xs text-muted-foreground">Not yet earned</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export const FollowCreatorButton = ({ creatorId, creatorName }: { creatorId: string; creatorName: string }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      // Implement follow/unfollow logic with Supabase
      setIsFollowing(!isFollowing);
      toast.success(
        isFollowing 
          ? `Unfollowed ${creatorName}` 
          : `Following ${creatorName}! You'll get notifications for their launches`
      );
    } catch (error) {
      toast.error("Failed to update follow status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={handleFollow}
      disabled={loading}
      className="flex items-center"
    >
      {isFollowing ? (
        <>
          <Bell className="w-4 h-4 mr-2" />
          Following
        </>
      ) : (
        <>
          <Users className="w-4 h-4 mr-2" />
          Follow
        </>
      )}
    </Button>
  );
};

export const RaidProgressMeter = ({ 
  currentAmount, 
  targetAmount, 
  participants,
  timeRemaining 
}: {
  currentAmount: number;
  targetAmount: number; 
  participants: number;
  timeRemaining: string;
}) => {
  const progress = Math.min((currentAmount / targetAmount) * 100, 100);
  const isNearComplete = progress >= 80;
  
  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-primary" />
            Raid Progress
          </div>
          <div className="flex items-center space-x-2">
            <Flame className={`w-4 h-4 ${isNearComplete ? 'text-orange-500' : 'text-muted-foreground'}`} />
            <span className="text-sm text-muted-foreground">{timeRemaining}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual Progress Meter - Rocket Fill Up */}
        <div className="relative">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-20 border-2 border-primary rounded-full bg-background flex items-end justify-center overflow-hidden">
                <div 
                  className="w-full bg-gradient-to-t from-primary to-accent transition-all duration-1000 ease-out"
                  style={{ height: `${progress}%` }}
                />
                <Zap className="absolute w-6 h-6 text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
          
          <Progress value={progress} className="h-3" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">${currentAmount.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Raised</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">{participants}</div>
            <div className="text-xs text-muted-foreground">Raiders</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">{progress.toFixed(0)}%</div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>

        {/* Milestone Alerts */}
        {isNearComplete && (
          <div className="text-center p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
            <div className="flex items-center justify-center space-x-2">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <span className="text-sm font-medium text-orange-600">
                🔥 Almost there! Final push needed!
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const SocialProofCounter = () => {
  const stats = {
    clipsCreated: 45678,
    rewardsPaid: 125340,
    activeCreators: 3456,
    totalViews: 2100000
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-3xl font-bold text-primary">{stats.clipsCreated.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Clips Created</div>
        </CardContent>
      </Card>
      
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-3xl font-bold text-green-500">${stats.rewardsPaid.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Rewards Paid</div>
        </CardContent>
      </Card>
      
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-3xl font-bold text-accent">{stats.activeCreators.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Active Creators</div>
        </CardContent>
      </Card>
      
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="text-3xl font-bold text-purple-500">{(stats.totalViews / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-muted-foreground">Total Views</div>
        </CardContent>
      </Card>
    </div>
  );
};