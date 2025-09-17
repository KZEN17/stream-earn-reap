import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginModal } from "@/contexts/LoginModalContext";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ExternalLink, 
  Download,
  Play,
  TrendingUp,
  Eye,
  DollarSign,
  Bell,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  Lock,
  Unlock,
  Gift,
  Plus,
  Sparkles,
  Share2,
  Twitter,
  Copy,
  MessageCircle
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useLaunchEvents } from "@/hooks/useLaunchEvents";
import { LaunchCreator } from "@/components/launch/LaunchCreator";
import { supabase } from "@/integrations/supabase/client";

const Calendar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { requireAuth } = useLoginModal();  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [notifications, setNotifications] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customAmounts, setCustomAmounts] = useState<{[key: number]: string}>({});
  const [unlockedLaunches, setUnlockedLaunches] = useState<number[]>([]);
  const { toast } = useToast();
  const { events, loading: eventsLoading } = useLaunchEvents();

  const handleDonate = (launchId: number, amount: number) => {
    if (!requireAuth()) return;
    
    const updatedLaunches = upcomingLaunches.map(launch => {
      if (launch.id === launchId) {
        const newAmount = launch.donationAmount + amount;
        const wasLocked = !launch.isUnlocked;
        const shouldUnlock = newAmount >= launch.donationTarget;
        
        if (wasLocked && shouldUnlock) {
          setShowConfetti(true);
          setUnlockedLaunches(prev => [...prev, launchId]);
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
    });
    
    toast({
      title: "Donation Successful!",
      description: `Thank you for contributing $${amount} to unlock this launch!`,
    });
  };

  const handleCustomDonate = (launchId: number) => {
    const amount = parseInt(customAmounts[launchId] || '0');
    if (amount > 0) {
      handleDonate(launchId, amount);
      setCustomAmounts(prev => ({ ...prev, [launchId]: '' }));
    }
  };

  const getProgressMilestone = (percentage: number) => {
    if (percentage >= 100) return { glow: 'shadow-[0_0_20px_hsl(142_75%_45%)]', color: 'hsl(142 75% 45%)' };
    if (percentage >= 75) return { glow: 'shadow-[0_0_15px_hsl(45_100%_50%)]', color: 'hsl(45 100% 50%)' };
    if (percentage >= 50) return { glow: 'shadow-[0_0_10px_hsl(210_100%_50%)]', color: 'hsl(210 100% 50%)' };
    return { glow: '', color: 'hsl(285 72% 60%)' };
  };

  // Transform events data to match the UI format
  const upcomingLaunches = events.map((event, index) => ({
    id: parseInt(event.id.slice(-8), 16), // Convert UUID to number for legacy code
    title: event.title,
    dateTimeISO: event.scheduled_date,
    streamLink: `https://twitch.tv/${event.user_id}`, // Placeholder
    tokenLink: "#", // Placeholder
    streamer: `@${event.user_id}`, // Placeholder
    streamerName: event.title.split(' ')[0] || "Anonymous",
    streamerAvatar: event.thumbnail_url || "/icon-192x192.png",
    description: event.description || "Join this exciting launch event!",
    status: event.status,
    priority: index % 2 === 0 ? "high" : "medium",
    expectedViews: event.max_participants * 100, // Estimate views based on participants
    tokenSymbol: event.title.includes('$') ? event.title.match(/\$\w+/)?.[0] || "$TOKEN" : "$TOKEN",
    donationAmount: 0, // No donation system for real events
    donationTarget: 1000,
    isUnlocked: true // All real events are unlocked
  }));

  const streamers = [
    {
      id: 1,
      username: "@moonmaster",
      name: "Moon Master",
      avatar: "/icon-192x192.png",
      followers: 45000,
      isVerified: true,
      status: "live",
      nextLaunch: "2024-12-20T19:00:00Z"
    },
    {
      id: 2,
      username: "@rocketman",
      name: "Rocket Man",
      avatar: "/icon-192x192.png", 
      followers: 32000,
      isVerified: true,
      status: "offline",
      nextLaunch: "2024-12-22T23:00:00Z"
    },
    {
      id: 3,
      username: "@cryptoqueen",
      name: "Crypto Queen",
      avatar: "/icon-192x192.png",
      followers: 58000,
      isVerified: true,
      status: "scheduled",
      nextLaunch: "2024-12-25T01:00:00Z"
    }
  ];

  const pastLaunches = [
    {
      id: 1,
      title: "$PUMP Launch Event",
      date: "Dec 15, 2024",
      clipsCount: 24,
      totalViews: 450000,
      feesGenerated: 1250,
      streamer: "@pumpmaster"
    },
    {
      id: 2,
      title: "$HODL Stream Marathon", 
      date: "Dec 12, 2024",
      clipsCount: 18,
      totalViews: 320000,
      feesGenerated: 980,
      streamer: "@hodlking"
    },
    {
      id: 3,
      title: "$MEME Token Reveal",
      date: "Dec 10, 2024", 
      clipsCount: 31,
      totalViews: 580000,
      feesGenerated: 1750,
      streamer: "@memelord"
    }
  ];

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
      })
    };
  };

  const generateICS = (launch: typeof upcomingLaunches[0]) => {
    const startDate = new Date(launch.dateTimeISO);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
    
    const formatDateForICS = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CLIP//Launch Calendar//EN
BEGIN:VEVENT
UID:${launch.id}@clip.app
DTSTAMP:${formatDateForICS(new Date())}
DTSTART:${formatDateForICS(startDate)}
DTEND:${formatDateForICS(endDate)}
SUMMARY:${launch.title}
DESCRIPTION:${launch.description}\\n\\nStream: ${launch.streamLink}\\nToken: ${launch.tokenLink}
LOCATION:${launch.streamLink}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${launch.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStreamerStatus = (status: string) => {
    switch (status) {
      case "live":
        return { color: "bg-pink", text: "Live Now" };
      case "scheduled":
        return { color: "bg-yellow", text: "Scheduled" };
      default:
        return { color: "bg-muted", text: "Offline" };
    }
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  const handleCreateLaunch = () => {
    if (user) {
      setShowCreateModal(true);
    } else {
      navigate('/auth');
    }
  };

  const handleShare = (platform: string, launch: typeof upcomingLaunches[0]) => {
    const shareUrl = window.location.href;
    const shareText = `Check out ${launch.isUnlocked ? launch.title : 'this mystery launch'} on the Launch Calendar! 🚀`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'discord':
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast({
          title: "Copied to clipboard!",
          description: "Share link copied. Paste it in Discord!",
        });
        break;
      case 'copy':
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast({
          title: "Link copied!",
          description: "Launch link copied to clipboard",
        });
        break;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showConfetti && <Confetti />}
      <div className="space-y-8">
        {/* Sticky Onboarding Header */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border pb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Mission Statement */}
            <Card className="flex-1 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Launch your token stream today.</h3>
                    <p className="text-sm text-muted-foreground">Create, stream, and get featured in the calendar.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Create Launch CTA */}
            <Button
              onClick={handleCreateLaunch}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary-glow text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create a Launch
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-gradient-rainbow">Launch Calendar</h1>
          <p className="text-xl text-muted-foreground">
            Never miss a pump.fun launch event
          </p>
          
          <div className="flex justify-center">
            <Button
              variant={notifications ? "default" : "outline"}
              onClick={toggleNotifications}
              className="flex items-center gap-2"
            >
              <Bell className={`w-4 h-4 ${notifications ? "text-white" : "text-muted-foreground"}`} />
              {notifications ? "Notifications On" : "Enable Notifications"}
            </Button>
          </div>

          {/* Contribution Info Note */}
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 justify-center">
                  <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Contributions unlock launches and fund initial allocation + DEX fees
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Stories Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6 text-success" />
                Success Stories
              </h2>
              <p className="text-muted-foreground">Real streamers, real results</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                streamerName: "Moon Master",
                streamerUsername: "@moonmaster",
                streamerAvatar: "/placeholder.svg",
                tokenName: "$MOON",
                amountRaised: 125000,
                viewsGained: 250000,
                quote: "Hit 25K views in 24h!"
              },
              {
                id: 2,
                streamerName: "Crypto Queen", 
                streamerUsername: "@cryptoqueen",
                streamerAvatar: "/placeholder.svg",
                tokenName: "$DIAMOND",
                amountRaised: 89000,
                viewsGained: 180000,
                quote: "Community funded in 10 minutes!"
              },
              {
                id: 3,
                streamerName: "Rocket Man",
                streamerUsername: "@rocketman", 
                streamerAvatar: "/placeholder.svg",
                tokenName: "$ROCKET",
                amountRaised: 67000,
                viewsGained: 145000,
                quote: "Turned 2K followers into 15K overnight!"
              }
            ].map((story) => (
              <Card 
                key={story.id} 
                className="hover-lift cursor-pointer border-success/20 bg-gradient-to-br from-success/5 to-accent/5 transition-all duration-300 hover:shadow-glow"
                onClick={() => navigate('/success-stories')}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-success/30">
                      <AvatarImage src={story.streamerAvatar} alt={story.streamerName} />
                      <AvatarFallback className="bg-success/20 text-success font-semibold">
                        {story.streamerName.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <h3 className="font-semibold text-sm">{story.streamerName}</h3>
                        <CheckCircle className="w-3 h-3 text-success" />
                      </div>
                      <p className="text-xs text-muted-foreground">{story.streamerUsername}</p>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">
                      {story.tokenName}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <div className="text-lg font-bold text-success">
                        ${(story.amountRaised / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <DollarSign className="w-2 h-2" />
                        Raised
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-secondary">
                        {(story.viewsGained / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <Eye className="w-2 h-2" />
                        Views
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-2 border-l-2 border-success">
                    <p className="text-xs italic text-center">"{story.quote}"</p>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-xs text-success">
                    <Sparkles className="w-3 h-3" />
                    <span>Unlocked Success</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/success-stories')}
              className="text-success border-success/30 hover:bg-success/10"
            >
              See More Success Stories
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="streamers">Streamers</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Launch Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border-0 pointer-events-auto"
                  />
                </CardContent>
              </Card>

              {/* Selected Date Launches */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {selectedDate ? `Launches for ${selectedDate.toLocaleDateString()}` : "Select a Date"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {eventsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Loading events...</p>
                    </div>
                  ) : upcomingLaunches.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No events scheduled yet</p>
                      <Button onClick={handleCreateLaunch} size="sm">
                        Create Your First Event
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                    {upcomingLaunches.map((launch) => {
                      const { date, time } = formatDateTime(launch.dateTimeISO);
                      const priority = launch.priority === "high" ? "destructive" : "secondary";
                      const progressPercentage = (launch.donationAmount / launch.donationTarget) * 100;
                      const milestone = getProgressMilestone(progressPercentage);
                      const isRecentlyUnlocked = unlockedLaunches.includes(launch.id);
                      
                      return (
                         <Card key={launch.id} className={`hover-lift transition-all duration-500 ${isRecentlyUnlocked ? 'animate-pulse border-green-500 shadow-glow' : ''} bg-card/50 backdrop-blur-sm border-border/50`}>
                           <CardContent className="p-4 relative">
                             {/* Top-right status badge */}
                             <div className="absolute top-3 right-3 z-10">
                               {!launch.isUnlocked ? (
                                 <Badge className="bg-orange-500/90 text-white backdrop-blur-sm text-xs px-2 py-1">
                                   <Lock className="w-3 h-3 mr-1" />
                                   Locked – Contribute to Unlock
                                 </Badge>
                               ) : isRecentlyUnlocked ? (
                                 <Badge className="bg-green-500/90 text-white backdrop-blur-sm text-xs px-2 py-1 animate-fade-in">
                                   <Sparkles className="w-3 h-3 mr-1" />
                                   Unlocked!
                                 </Badge>
                               ) : (
                                 <Badge className="bg-green-500/90 text-white backdrop-blur-sm text-xs px-2 py-1">
                                   <CheckCircle className="w-3 h-3 mr-1" />
                                   Unlocked
                                 </Badge>
                               )}
                             </div>

                              <div className="flex items-start gap-4 pr-20">
                                <Avatar className="w-12 h-12 border-2 border-primary/20">
                                  <AvatarImage src={launch.streamerAvatar} alt={launch.streamerName} />
                                  <AvatarFallback className="bg-primary/10">
                                    {launch.isUnlocked ? launch.streamerName.slice(0, 2) : '??'}
                                  </AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1 space-y-3">
                                  <div className="space-y-1">
                                    <h3 className="font-semibold text-lg">
                                      {launch.isUnlocked ? launch.title : 'Mystery Launch'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Star className="w-3 h-3" />
                                      {launch.isUnlocked ? launch.streamerName : '???'}
                                    </p>
                                  </div>
                                  
                                  <p className="text-sm text-muted-foreground">
                                    {launch.isUnlocked ? launch.description : 'Unlock this exclusive launch by contributing to pre-donations! Big surprise awaits...'}
                                  </p>
                                  
                                  <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {time}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Eye className="w-3 h-3" />
                                      {launch.expectedViews.toLocaleString()} expected
                                    </div>
                                  </div>

                                 {/* Progress Section for Locked Launches */}
                                 {!launch.isUnlocked && (
                                   <div className="space-y-3 bg-muted/30 rounded-lg p-4 border border-border/30">
                                     <div className="flex items-center justify-between text-sm">
                                       <span className="font-medium text-foreground">Contribution Goal</span>
                                       <span className="font-bold text-foreground">
                                         ${launch.donationAmount} of ${launch.donationTarget} raised
                                       </span>
                                     </div>
                                     
                                     <div className={`relative ${milestone.glow}`}>
                                       <Progress 
                                         value={progressPercentage} 
                                         className="h-3 bg-muted"
                                         animated={true}
                                         showGlow={progressPercentage >= 50}
                                       />
                                       {progressPercentage >= 50 && (
                                         <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                                       )}
                                     </div>

                                     {/* Contribution Buttons */}
                                     <div className="space-y-2">
                                       <div className="flex gap-2 flex-wrap">
                                         {[25, 50, 100].map((amount) => (
                                           <Button
                                             key={amount}
                                             size="sm"
                                             variant="outline"
                                             onClick={() => handleDonate(launch.id, amount)}
                                             className="rounded-full bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary font-medium text-xs px-4 py-1"
                                           >
                                             ${amount}
                                           </Button>
                     ))}
                   </div>
                                       
                                       {/* Custom Amount */}
                                       <div className="flex gap-2 items-center">
                                         <Input
                                           type="number"
                                           placeholder="Custom amount"
                                           value={customAmounts[launch.id] || ''}
                                           onChange={(e) => setCustomAmounts(prev => ({ ...prev, [launch.id]: e.target.value }))}
                                           className="flex-1 h-8 text-xs rounded-full bg-background/50 border-border/50"
                                         />
                                         <Button
                                           size="sm"
                                           onClick={() => handleCustomDonate(launch.id)}
                                           disabled={!customAmounts[launch.id] || parseInt(customAmounts[launch.id]) <= 0}
                                           className="rounded-full bg-gradient-primary hover:opacity-90 text-white font-medium text-xs px-4 py-1"
                                         >
                                           Contribute
                                         </Button>
                                       </div>
                                     </div>
                                   </div>
                                 )}
                                 
                                  {/* Action Buttons for All Launches */}
                                  <div className={`flex gap-2 ${isRecentlyUnlocked ? 'animate-fade-in' : ''}`}>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-1">
                                          <Share2 className="w-3 h-3" />
                                          Share
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleShare('twitter', launch)}>
                                          <Twitter className="w-4 h-4 mr-2" />
                                          Share on Twitter
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleShare('discord', launch)}>
                                          <MessageCircle className="w-4 h-4 mr-2" />
                                          Share on Discord
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleShare('copy', launch)}>
                                          <Copy className="w-4 h-4 mr-2" />
                                          Copy Link
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                    
                                    {launch.isUnlocked && (
                                      <>
                                        <Button 
                                          size="sm" 
                                          variant="default"
                                          className={`${isRecentlyUnlocked ? 'bg-gradient-primary shadow-glow animate-pulse' : ''}`}
                                        >
                                          <Bell className="w-3 h-3 mr-1" />
                                          Notify Me
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant="outline" 
                                          asChild
                                          className={`${isRecentlyUnlocked ? 'border-primary text-primary shadow-glow animate-pulse' : ''}`}
                                        >
                                          <a href={launch.streamLink} target="_blank">
                                            <Play className="w-3 h-3 mr-1" />
                                            Stream
                                          </a>
                                        </Button>
                                      </>
                                    )}
                                  </div>
                               </div>
                             </div>
                           </CardContent>
                         </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="streamers" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {streamers.map((streamer) => {
                const status = getStreamerStatus(streamer.status);
                const nextLaunch = formatDateTime(streamer.nextLaunch);
                
                return (
                  <Card key={streamer.id} className="hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={streamer.avatar} alt={streamer.name} />
                            <AvatarFallback>{streamer.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${status.color} border-2 border-background`} />
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{streamer.name}</h3>
                            {streamer.isVerified && (
                              <CheckCircle className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{streamer.username}</p>
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="w-3 h-3" />
                            {streamer.followers.toLocaleString()} followers
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {status.text}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t space-y-3">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Next Launch:</span>
                          <br />
                          <span className="font-medium">{nextLaunch.date}</span>
                          <br />
                          <span className="text-muted-foreground">{nextLaunch.time}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Bell className="w-3 h-3 mr-1" />
                            Follow
                          </Button>
                          <Button size="sm" variant="default" className="flex-1">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {upcomingLaunches.map((launch) => {
                const { date, time } = formatDateTime(launch.dateTimeISO);
                const priority = launch.priority === "high" ? "destructive" : "secondary";
                const progressPercentage = (launch.donationAmount / launch.donationTarget) * 100;
                const milestone = getProgressMilestone(progressPercentage);
                const isRecentlyUnlocked = unlockedLaunches.includes(launch.id);
                
                return (
                  <Card key={launch.id} className={`hover-lift shadow-card transition-all duration-500 ${isRecentlyUnlocked ? 'animate-pulse border-green-500 shadow-glow' : ''} bg-card/50 backdrop-blur-sm border-border/50`}>
                    <CardHeader className="relative">
                      {/* Top-right status badge */}
                      <div className="absolute top-4 right-4 z-10">
                        {!launch.isUnlocked ? (
                          <Badge className="bg-orange-500/90 text-white backdrop-blur-sm text-xs px-2 py-1">
                            <Lock className="w-3 h-3 mr-1" />
                            Locked – Contribute to Unlock
                          </Badge>
                        ) : isRecentlyUnlocked ? (
                          <Badge className="bg-green-500/90 text-white backdrop-blur-sm text-xs px-2 py-1 animate-fade-in">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Unlocked!
                          </Badge>
                        ) : (
                          <Badge className="bg-green-500/90 text-white backdrop-blur-sm text-xs px-2 py-1">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Unlocked
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-start justify-between pr-24">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{launch.isUnlocked ? launch.tokenSymbol : '$???'}</Badge>
                          </div>
                          <CardTitle className="text-xl">
                            {launch.isUnlocked ? launch.title : 'Mystery Launch'}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6 border border-primary/20">
                              <AvatarImage src={launch.streamerAvatar} alt={launch.streamerName} />
                              <AvatarFallback className="bg-primary/10 text-xs">
                                {launch.isUnlocked ? launch.streamerName.slice(0, 2) : '??'}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-sm text-muted-foreground">{launch.isUnlocked ? launch.streamerName : '???'}</p>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-medium">{date}</div>
                          <div className="text-muted-foreground flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {time}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        {launch.isUnlocked ? launch.description : 'Unlock this exclusive launch by contributing to pre-donations! Big surprise awaits...'}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {launch.expectedViews.toLocaleString()} expected views
                        </div>
                      </div>

                      {/* Progress Section for Locked Launches */}
                      {!launch.isUnlocked && (
                        <div className="space-y-3 bg-muted/30 rounded-lg p-4 border border-border/30">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-foreground">Contribution Goal</span>
                            <span className="font-bold text-foreground">
                              ${launch.donationAmount} of ${launch.donationTarget} raised
                            </span>
                          </div>
                          
                          <div className={`relative ${milestone.glow}`}>
                            <Progress 
                              value={progressPercentage} 
                              className="h-3 bg-muted"
                              animated={true}
                              showGlow={progressPercentage >= 50}
                            />
                            {progressPercentage >= 50 && (
                              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                            )}
                          </div>

                          {/* Contribution Buttons */}
                          <div className="space-y-2">
                            <div className="flex gap-2 flex-wrap">
                              {[25, 50, 100].map((amount) => (
                                <Button
                                  key={amount}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDonate(launch.id, amount)}
                                  className="rounded-full bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary font-medium text-xs px-4 py-1"
                                >
                                  ${amount}
                                </Button>
                              ))}
                            </div>
                            
                            {/* Custom Amount */}
                            <div className="flex gap-2 items-center">
                              <Input
                                type="number"
                                placeholder="Custom amount"
                                value={customAmounts[launch.id] || ''}
                                onChange={(e) => setCustomAmounts(prev => ({ ...prev, [launch.id]: e.target.value }))}
                                className="flex-1 h-8 text-xs rounded-full bg-background/50 border-border/50"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleCustomDonate(launch.id)}
                                disabled={!customAmounts[launch.id] || parseInt(customAmounts[launch.id]) <= 0}
                                className="rounded-full bg-gradient-primary hover:opacity-90 text-white font-medium text-xs px-4 py-1"
                              >
                                Contribute
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Action Buttons for All Launches */}
                      <div className={`flex flex-wrap gap-2 ${isRecentlyUnlocked ? 'animate-fade-in' : ''}`}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Share2 className="w-3 h-3" />
                              Share
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleShare('twitter', launch)}>
                              <Twitter className="w-4 h-4 mr-2" />
                              Share on Twitter
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare('discord', launch)}>
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Share on Discord
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare('copy', launch)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Link
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        {launch.isUnlocked && (
                          <>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => generateICS(launch)}
                              className={`flex items-center space-x-1 ${isRecentlyUnlocked ? 'bg-gradient-primary shadow-glow animate-pulse' : ''}`}
                            >
                              <Download className="w-4 h-4" />
                              <span>Set Reminder</span>
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              asChild
                              className={`${isRecentlyUnlocked ? 'border-primary text-primary shadow-glow animate-pulse' : ''}`}
                            >
                              <a href={launch.streamLink} target="_blank" rel="noopener noreferrer">
                                <Play className="w-4 h-4 mr-1" />
                                View Stream
                              </a>
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              asChild
                            >
                              <a href={launch.tokenLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Token Page
                              </a>
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Past Launches */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold flex items-center space-x-2">
            <TrendingUp className="w-8 h-8 text-secondary" />
            <span>Past Launches</span>
          </h2>
          
          <div className="grid gap-6">
            {pastLaunches.map((launch) => (
              <Card key={launch.id} className="hover-lift shadow-card">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{launch.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{launch.date}</span>
                        <span>•</span>
                        <span>{launch.streamer}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-primary">{launch.clipsCount}</div>
                        <div className="text-sm text-muted-foreground">Clips</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-secondary flex items-center justify-center">
                          <Eye className="w-5 h-5 mr-1" />
                          {(launch.totalViews / 1000).toFixed(0)}K
                        </div>
                        <div className="text-sm text-muted-foreground">Views</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-accent flex items-center justify-center">
                          <DollarSign className="w-5 h-5 mr-1" />
                          {launch.feesGenerated}
                        </div>
                        <div className="text-sm text-muted-foreground">Fees</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
                ))}
              </div>
              )}
            </TabsContent>
        </Tabs>
            </TabsContent>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl p-8">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Want to Launch Your Token?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get featured on our launch calendar and tap into our clipper network for maximum exposure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" onClick={() => navigate('/apply-streamer')}>
                Submit Launch Request
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/guide')}>
                View Launch Guide
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Create Launch Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <LaunchCreator 
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              toast({
                title: "Success!",
                description: "Your launch event has been created and will appear in the calendar.",
              });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Calendar;