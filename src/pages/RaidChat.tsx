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
  PlayCircle
} from "lucide-react";

const RaidChat = () => {
  const currentRaidSession = {
    id: 1,
    title: "MEGA PUMP RAID",
    targetChannel: "@cryptoking",
    startTime: "2024-12-19T20:00:00Z",
    endTime: "2024-12-19T22:00:00Z",
    participants: 234,
    totalRaised: 2450,
    status: "live"
  };

  const upcomingRaids = [
    {
      id: 2,
      title: "Holiday Token Celebration",
      targetChannel: "@holidaystreamer",
      startTime: "2024-12-20T19:00:00Z",
      participants: 0,
      estimatedBudget: 1500
    },
    {
      id: 3,
      title: "New Year Launch Support",
      targetChannel: "@newyeartoken", 
      startTime: "2024-12-31T23:00:00Z",
      participants: 0,
      estimatedBudget: 3000
    }
  ];

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

        {/* Live/Current Raid Session */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold flex items-center space-x-2">
            <PlayCircle className="w-8 h-8 text-primary" />
            <span>Current Raid Session</span>
          </h2>
          
          <Card className="border-primary/50 shadow-glow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                    <span className="text-sm text-muted-foreground">
                      Ends at {formatTime(currentRaidSession.endTime)}
                    </span>
                  </div>
                  <CardTitle className="text-2xl">{currentRaidSession.title}</CardTitle>
                  <p className="text-muted-foreground">Target: {currentRaidSession.targetChannel}</p>
                </div>
                <div className="text-right space-y-2">
                  <div className="text-3xl font-bold text-gradient-primary">
                    ${currentRaidSession.totalRaised}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Raised</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <span>{currentRaidSession.participants} participants</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="hero" size="sm">
                    Join Raid
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://discord.gg/clip" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Discord
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Upcoming Raids */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold flex items-center space-x-2">
            <Clock className="w-8 h-8 text-secondary" />
            <span>Upcoming Raids</span>
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {upcomingRaids.map((raid) => (
              <Card key={raid.id} className="hover-lift shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Badge variant="secondary">
                        {getTimeUntilStart(raid.startTime)}
                      </Badge>
                      <CardTitle className="text-lg">{raid.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">Target: {raid.targetChannel}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-xl font-bold text-gradient-secondary">
                        ${raid.estimatedBudget}
                      </div>
                      <div className="text-xs text-muted-foreground">Est. Budget</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {formatTime(raid.startTime)}
                    </div>
                    <Button variant="outline" size="sm">
                      Set Reminder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

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
    </div>
  );
};

export default RaidChat;