import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  Play,
  Eye,
  DollarSign,
  Bell,
  Lock,
  Unlock
} from "lucide-react";
import { useState } from "react";
import Confetti from "react-confetti";

const Calendar = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  const [launches, setLaunches] = useState([
    {
      id: 1,
      title: "$MOON Token Launch Stream",
      dateTimeISO: "2025-09-16T03:00:00+08:00",
      streamLink: "https://twitch.tv/moonmaster",
      streamer: "@moonmaster",
      streamerName: "Moon Master",
      streamerAvatar: "/placeholder.svg",
      description: "Join us for the biggest token launch of the month! Interactive stream with live trading.",
      priority: "high",
      expectedViews: 25000,
      donationAmount: 1250,
      donationTarget: 1000,
      isUnlocked: true
    },
    {
      id: 2,
      title: "Launch Locked",
      dateTimeISO: "2025-09-16T05:30:00+08:00", 
      streamLink: "https://twitch.tv/rocketman",
      streamer: "@rocketman",
      streamerName: "???",
      streamerAvatar: "/placeholder.svg",
      description: "Contribute to unlock this exclusive launch!",
      priority: "medium",
      expectedViews: 18000,
      donationAmount: 750,
      donationTarget: 1000,
      isUnlocked: false
    },
    {
      id: 3,
      title: "Launch Locked",
      dateTimeISO: "2025-09-16T08:15:00+08:00",
      streamLink: "https://twitch.tv/cryptoqueen", 
      streamer: "@cryptoqueen",
      streamerName: "???",
      streamerAvatar: "/placeholder.svg",
      description: "Contribute to unlock this exclusive launch!",
      priority: "high",
      expectedViews: 32000,
      donationAmount: 450,
      donationTarget: 1000,
      isUnlocked: false
    }
  ]);

  const handleDonate = (launchId: number, amount: number) => {
    setLaunches(prevLaunches => 
      prevLaunches.map(launch => {
        if (launch.id === launchId) {
          const newAmount = launch.donationAmount + amount;
          const wasLocked = !launch.isUnlocked;
          const shouldUnlock = newAmount >= launch.donationTarget;
          
          if (wasLocked && shouldUnlock) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
            toast({
              title: "🎉 Launch Unlocked!",
              description: `Congratulations! The launch has been revealed thanks to community support!`,
            });
          }
          
          return {
            ...launch,
            donationAmount: newAmount,
            isUnlocked: shouldUnlock || launch.isUnlocked
          };
        }
        return launch;
      })
    );
    
    toast({
      title: "Donation Successful!",
      description: `Thank you for contributing $${amount} to unlock this launch!`,
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Sort launches by time
  const sortedLaunches = [...launches].sort((a, b) => 
    new Date(a.dateTimeISO).getTime() - new Date(b.dateTimeISO).getTime()
  );

  // Get the date from the first launch for the header
  const headerDate = sortedLaunches[0] ? formatDate(sortedLaunches[0].dateTimeISO) : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showConfetti && <Confetti />}
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Launches for {headerDate}
        </h1>
      </div>

      {/* Launch Cards */}
      <div className="space-y-6">
        {sortedLaunches.map((launch) => {
          if (launch.isUnlocked) {
            // Unlocked Launch Card
            return (
              <Card key={launch.id} className="bg-muted/20 border-muted/30 hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Avatar className="w-16 h-16 border-2 border-muted/50">
                      <AvatarImage src={launch.streamerAvatar} alt={launch.streamerName} />
                      <AvatarFallback className="text-lg font-semibold">
                        {launch.streamerName.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Main Content */}
                    <div className="flex-1 space-y-3">
                      {/* Title and Priority Badge */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            {launch.title}
                            <Unlock className="w-5 h-5 text-green-500" />
                          </h2>
                        </div>
                        <Badge 
                          variant={launch.priority === "high" ? "destructive" : "secondary"}
                          className="px-3 py-1"
                        >
                          {launch.priority} priority
                        </Badge>
                      </div>

                      {/* Streamer Name */}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>⭐</span>
                        <span>{launch.streamerName}</span>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground">
                        {launch.description}
                      </p>

                      {/* Time and Expected Views */}
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(launch.dateTimeISO)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>{launch.expectedViews.toLocaleString()} expected</span>
                        </div>
                        <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10">
                          🔓 Unlocked!
                        </Badge>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <Button 
                          className="bg-primary hover:bg-primary/90 text-white px-6"
                          onClick={() => toast({ title: "Notification Set!", description: "You'll be notified when this launch starts." })}
                        >
                          <Bell className="w-4 h-4 mr-2" />
                          Notify Me
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-primary/30 text-primary hover:bg-primary/10"
                          asChild
                        >
                          <a href={launch.streamLink} target="_blank" rel="noopener noreferrer">
                            <Play className="w-4 h-4 mr-2" />
                            Stream
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          } else {
            // Locked Launch Card
            return (
              <Card key={launch.id} className="bg-muted/20 border-muted/30 relative overflow-hidden">
                {/* Blurred Background Content */}
                <div className="filter blur-sm opacity-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16 border-2 border-muted/50">
                        <AvatarFallback className="text-lg font-semibold">??</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <h2 className="text-xl font-bold text-white">████████████████</h2>
                          <div className="w-20 h-6 bg-red-500/50 rounded"></div>
                        </div>
                        <div className="w-24 h-4 bg-muted/50 rounded"></div>
                        <div className="space-y-2">
                          <div className="w-full h-4 bg-muted/50 rounded"></div>
                          <div className="w-3/4 h-4 bg-muted/50 rounded"></div>
                        </div>
                        <div className="flex gap-6">
                          <div className="w-24 h-4 bg-muted/50 rounded"></div>
                          <div className="w-32 h-4 bg-muted/50 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Lock Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                  <div className="text-center space-y-6 max-w-md">
                    {/* Lock Icon */}
                    <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                      <Lock className="w-8 h-8 text-primary" />
                    </div>

                    {/* Title and Description */}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white">Launch Locked</h3>
                      <p className="text-muted-foreground">
                        Contribute to unlock this exclusive launch!
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-3 w-full">
                      <Progress 
                        value={(launch.donationAmount / launch.donationTarget) * 100} 
                        className="h-3"
                        animated={true}
                        showGlow={true}
                      />
                      <p className="text-sm text-muted-foreground font-medium">
                        ${launch.donationAmount} / ${launch.donationTarget}
                      </p>
                    </div>

                    {/* Contribution Buttons */}
                    <div className="flex gap-3 justify-center">
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-white px-6"
                        onClick={() => handleDonate(launch.id, 25)}
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        $25
                      </Button>
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-white px-6"
                        onClick={() => handleDonate(launch.id, 50)}
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        $50
                      </Button>
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-white px-6"
                        onClick={() => handleDonate(launch.id, 100)}
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        $100
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Calendar;