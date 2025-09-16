import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Clock, 
  Users, 
  DollarSign,
  Gift,
  TrendingUp,
  ExternalLink,
  PlayCircle,
  Plus
} from "lucide-react";
import { useRaidEvents } from "@/hooks/useRaidEvents";
import { useAuth } from "@/contexts/AuthContext";
import { RaidCreator } from "@/components/raid/RaidCreator";
import { RaidCard } from "@/components/raid/RaidCard";
import { useToast } from "@/hooks/use-toast";

const RaidChat = () => {
  const [showCreator, setShowCreator] = useState(false);
  const { raids, loading, joinRaid } = useRaidEvents();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fake placeholder data until real raids are published
  const placeholderRaids = [
    {
      id: 'fake-1',
      title: 'MEGA PUMP RAID',
      description: 'Coordinated support for the biggest token launch of the year',
      target_url: 'https://twitch.tv/cryptoking',
      mission_type: 'takeover' as const,
      status: 'live',
      current_participants: 234,
      max_participants: 500,
      goal_amount: 5000,
      total_raised: 2450,
      goal_description: 'Token launch support',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      leader_id: 'fake-leader-1',
      scheduled_time: new Date().toISOString(),
      twitch_stream_url: 'https://twitch.tv/cryptoking'
    },
    {
      id: 'fake-2', 
      title: 'Holiday Support Mission',
      description: 'Supporting our community streamer during the holiday celebration stream',
      target_url: 'https://youtube.com/watch?v=holidaystream',
      mission_type: 'support' as const,
      status: 'scheduled',
      current_participants: 0,
      max_participants: 200,
      goal_amount: 1500,
      total_raised: 0,
      goal_description: 'Holiday gift fund',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      leader_id: 'fake-leader-2',
      scheduled_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      twitch_stream_url: 'https://youtube.com/watch?v=holidaystream'
    },
    {
      id: 'fake-3',
      title: 'New Year Launch Mission', 
      description: 'Coordinated launch support to kick off the new year with massive momentum',
      target_url: 'https://twitch.tv/newyeartoken',
      mission_type: 'mission' as const,
      status: 'scheduled',
      current_participants: 12,
      max_participants: 300,
      goal_amount: 3000,
      total_raised: 150,
      goal_description: 'Launch milestone fund',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      leader_id: 'fake-leader-3',
      scheduled_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      twitch_stream_url: 'https://twitch.tv/newyeartoken'
    }
  ];

  // Use real raids if available, otherwise use placeholder data
  const displayRaids = raids.length > 0 ? raids : placeholderRaids;
  const liveRaids = displayRaids.filter(raid => raid.status === 'live');
  const scheduledRaids = displayRaids.filter(raid => raid.status === 'scheduled');
  const currentRaid = liveRaids[0]; // Show first live raid as current

  const handleJoinRaid = async (raidId: string) => {
    try {
      await joinRaid(raidId);
      toast({
        title: "Joined RAID!",
        description: "You've successfully joined the raid.",
      });
    } catch (error) {
      toast({
        title: "Failed to Join",
        description: error instanceof Error ? error.message : "Failed to join raid",
        variant: "destructive"
      });
    }
  };

  const recentActions = [
    {
      id: 1,
      time: "2 min ago",
      actionType: "donate" as const,
      amount: 25,
      targetChannel: "@cryptoking",
      proofUrl: "https://twitch.tv/cryptoking/clip/abc123",
      user: "@raidmaster"
    },
    {
      id: 2,
      time: "5 min ago", 
      actionType: "subs" as const,
      amount: 50,
      targetChannel: "@cryptoking",
      proofUrl: "https://twitch.tv/cryptoking/clip/def456", 
      user: "@subsquad"
    },
    {
      id: 3,
      time: "8 min ago",
      actionType: "token" as const,
      amount: 100,
      targetChannel: "@cryptoking",
      proofUrl: "https://pump.fun/tx/ghi789",
      user: "@tokenbuyer"
    },
    {
      id: 4,
      time: "12 min ago",
      actionType: "donate" as const,
      amount: 15,
      targetChannel: "@cryptoking", 
      proofUrl: "https://twitch.tv/cryptoking/clip/jkl012",
      user: "@donationking"
    },
    {
      id: 5,
      time: "15 min ago",
      actionType: "subs" as const,
      amount: 25,
      targetChannel: "@cryptoking",
      proofUrl: "https://twitch.tv/cryptoking/clip/mno345",
      user: "@subgifter"
    }
  ];

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "donate":
        return <DollarSign className="w-4 h-4 text-accent" />;
      case "subs": 
        return <Gift className="w-4 h-4 text-secondary" />;
      case "token":
        return <TrendingUp className="w-4 h-4 text-primary" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case "donate":
        return "text-accent";
      case "subs":
        return "text-secondary"; 
      case "token":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getTimeUntilStart = (startTime: string) => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const diff = start - now;
    
    if (diff <= 0) return "Live Now";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-gradient-rainbow">RAIDCHAT</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We raid, we donate, we buy subs, we buy tokens. Trade attention for growth.
          </p>
          {user && (
            <div className="pt-4">
              <Button 
                onClick={() => setShowCreator(true)}
                size="lg"
                className="gap-2 text-lg px-8 py-3"
                variant="hero"
              >
                <Plus className="w-5 h-5" />
                Create New RAID
              </Button>
            </div>
          )}
        </div>

        {/* Explainer */}
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">How RAIDCHAT Works</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Trade attention for growth. We coordinate community raids to support streamers, 
                fund subscriber gifts, and buy tokens during launches. Everyone benefits when we move together.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold">Donations</h3>
                  <p className="text-sm text-muted-foreground">Pool funds for impactful donations</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center mx-auto">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold">Subscriber Gifts</h3>
                  <p className="text-sm text-muted-foreground">Mass gift subs to grow communities</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto">
                    <TrendingUp className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold">Token Purchases</h3>
                  <p className="text-sm text-muted-foreground">Coordinate buys during launches</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live RAID Section */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold flex items-center justify-center space-x-2 mb-2">
              <PlayCircle className="w-8 h-8 text-primary" />
              <span>Live RAID Session</span>
            </h2>
            <p className="text-muted-foreground">Join the active community raid and contribute to the mission</p>
          </div>

          {/* Current Live Raid */}
          {currentRaid ? (
            <RaidCard raid={currentRaid} onJoin={handleJoinRaid} />
          ) : (
            <Card className="border-dashed border-2 border-muted-foreground/30">
              <CardContent className="p-12 text-center space-y-6">
                <div className="text-muted-foreground">
                  <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-3">No Active RAIDs</h3>
                  <p className="text-lg">Be the first to create a raid and rally the community!</p>
                </div>
                {user ? (
                  <Button 
                    onClick={() => setShowCreator(true)}
                    size="lg"
                    className="gap-2 text-lg px-8"
                  >
                    <Plus className="w-5 h-5" />
                    Launch First RAID
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Sign in to create and join RAIDs</p>
                    <Button variant="outline" size="lg">
                      Sign In
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </section>

        {/* Upcoming Raids */}
        {scheduledRaids.length > 0 && (
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold flex items-center justify-center space-x-2 mb-2">
                <Clock className="w-8 h-8 text-secondary" />
                <span>Upcoming Raids</span>
              </h2>
              <p className="text-muted-foreground">Scheduled community raids - set reminders and be ready</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {scheduledRaids.map((raid) => (
                <RaidCard key={raid.id} raid={raid} onJoin={handleJoinRaid} />
              ))}
            </div>

            {/* Quick Create CTA for upcoming section */}
            {user && (
              <div className="text-center pt-4">
                <Button 
                  onClick={() => setShowCreator(true)}
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Schedule Another RAID
                </Button>
              </div>
            )}
          </section>
        )}

        {/* Action Log */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold flex items-center space-x-2">
            <Zap className="w-8 h-8 text-accent" />
            <span>Live Action Log</span>
          </h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                        {getActionIcon(action.actionType)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{action.user}</span>
                          <span className="text-sm text-muted-foreground">
                            {action.actionType === "donate" && "donated"}
                            {action.actionType === "subs" && "gifted subs"}
                            {action.actionType === "token" && "bought tokens"}
                          </span>
                          <span className={`font-bold ${getActionColor(action.actionType)}`}>
                            ${action.amount}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{action.time}</span>
                          <span>•</span>
                          <span>{action.targetChannel}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={action.proofUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Participate CTA */}
        <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl p-8">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Join the Movement?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with our community and be part of coordinated raids that drive real impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <a href="https://discord.gg/clip" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Join Discord
                </a>
              </Button>
              <Button variant="outline" size="lg">
                Sign Up for Raids
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* RAID Creator Modal */}
      {showCreator && (
        <RaidCreator 
          onClose={() => setShowCreator(false)}
          onSuccess={() => {
            // Optional: Add any success handling here
          }}
        />
      )}
    </div>
  );
};

export default RaidChat;