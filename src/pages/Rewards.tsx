import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignCard } from "@/components/rewards/CampaignCard";
import { CampaignDetail } from "@/components/rewards/CampaignDetail";
import { 
  Gift, 
  Plus, 
  TrendingUp, 
  Target,
  Clock,
  Award,
  RefreshCw,
  Trophy,
  Zap,
  Filter
} from "lucide-react";

const Rewards = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("active");

  // Mock campaigns data
  const campaigns = {
    active: [
      {
        id: "1",
        title: "Holiday Crypto Clips Challenge",
        description: "Create viral clips featuring holiday-themed crypto content from top streamers",
        rewardPool: 5000,
        pointsPerClip: 100,
        participants: 89,
        maxParticipants: 200,
        deadline: "Dec 31, 2024",
        status: 'active' as const,
        requirements: ["15-60 seconds", "Holiday theme", "Original audio"],
        tags: ["Holiday", "Crypto", "Viral", "2x Bonus"],
        progress: 45
      },
      {
        id: "2",
        title: "Pump.fun Launch Moments",
        description: "Capture the best moments from new token launches and trading reactions",
        rewardPool: 3000,
        pointsPerClip: 75,
        participants: 67,
        maxParticipants: 150,
        deadline: "Jan 15, 2025",
        status: 'active' as const,
        requirements: ["Pump.fun content", "720p quality", "Under 45 seconds"],
        tags: ["Pump.fun", "Trading", "Launch"],
        progress: 44
      },
      {
        id: "3",
        title: "Epic Gaming Wins",
        description: "Focus on incredible gaming plays, clutch moments, and victory celebrations",
        rewardPool: 2000,
        pointsPerClip: 50,
        participants: 134,
        maxParticipants: 300,
        deadline: "Ongoing",
        status: 'active' as const,
        requirements: ["Gaming content", "Win/clutch moments", "Clear audio"],
        tags: ["Gaming", "Weekly", "Clutch"],
        progress: 45
      }
    ],
    upcoming: [
      {
        id: "4",
        title: "Valentine's Day Crypto Romance",
        description: "Create romantic and fun crypto-themed clips for Valentine's Day",
        rewardPool: 4000,
        pointsPerClip: 120,
        participants: 0,
        maxParticipants: 180,
        deadline: "Feb 14, 2025",
        status: 'upcoming' as const,
        requirements: ["Valentine theme", "Crypto content", "Positive vibes"],
        tags: ["Valentine", "Romance", "Crypto"],
        progress: 0
      }
    ],
    ended: [
      {
        id: "5",
        title: "Black Friday Crypto Deals",
        description: "Clips showcasing Black Friday crypto deals and trading opportunities",
        rewardPool: 3500,
        pointsPerClip: 80,
        participants: 156,
        maxParticipants: 200,
        deadline: "Nov 30, 2024",
        status: 'ended' as const,
        requirements: ["Black Friday theme", "Deal highlights", "Under 60s"],
        tags: ["Black Friday", "Deals", "Trading"],
        progress: 78
      }
    ]
  };

  const handleJoinCampaign = (campaignId: string) => {
    // Mock join functionality
    console.log("Joining campaign:", campaignId);
  };

  const handleViewCampaign = (campaignId: string) => {
    setSelectedCampaign(campaignId);
  };

  const handleBackToCampaigns = () => {
    setSelectedCampaign(null);
  };

  // If viewing campaign detail
  if (selectedCampaign) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CampaignDetail 
          campaignId={selectedCampaign}
          onBack={handleBackToCampaigns}
          onJoin={handleJoinCampaign}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-gradient-rainbow">Rewards</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Clipping rewards hosted on Whop. Earn more for creating viral content.
          </p>
        </div>

        {/* Rewards Hub Intro */}
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-2">
                <Trophy className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold">CLIP Rewards Hub</h2>
              </div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Earn rewards for creating viral clips. Join campaigns, compete with other clippers, 
                and get paid for your best content. The more viral your clips, the more you earn.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-gradient-primary">$15K+</div>
                  <div className="text-sm text-muted-foreground">Total Rewards Pool</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-gradient-secondary">290+</div>
                  <div className="text-sm text-muted-foreground">Active Clippers</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-gradient-accent">8</div>
                  <div className="text-sm text-muted-foreground">Live Campaigns</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Tabs */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold flex items-center space-x-2">
              <Target className="w-8 h-8 text-primary" />
              <span>Campaigns</span>
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active" className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Active ({campaigns.active.length})</span>
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Upcoming ({campaigns.upcoming.length})</span>
              </TabsTrigger>
              <TabsTrigger value="ended" className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>Ended ({campaigns.ended.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.active.map((campaign) => (
                  <CampaignCard 
                    key={campaign.id} 
                    campaign={campaign}
                    onJoin={handleJoinCampaign}
                    onView={handleViewCampaign}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.upcoming.map((campaign) => (
                  <CampaignCard 
                    key={campaign.id} 
                    campaign={campaign}
                    onJoin={handleJoinCampaign}
                    onView={handleViewCampaign}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ended" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.ended.map((campaign) => (
                  <CampaignCard 
                    key={campaign.id} 
                    campaign={campaign}
                    onJoin={handleJoinCampaign}
                    onView={handleViewCampaign}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Fee Recycling Explanation */}
        <Card className="border-accent/20 bg-gradient-to-r from-accent/5 to-accent/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <RefreshCw className="w-6 h-6 text-accent" />
              <span>Creator Fee Loop</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Creator fees are recycled into new clipping campaigns, creating a sustainable economy 
              where successful content generates more opportunities for creators.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold">Fees Generated</h3>
                <p className="text-sm text-muted-foreground">Streamers earn from viral clips</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center mx-auto">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold">Fees Recycled</h3>
                <p className="text-sm text-muted-foreground">Portion funds new campaigns</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto">
                  <Gift className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-semibold">More Rewards</h3>
                <p className="text-sm text-muted-foreground">Increased incentives for clippers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Participate */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">How to Participate</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: "Browse Campaigns",
                description: "Check active campaigns on Whop and choose ones that match your interests."
              },
              {
                step: 2, 
                title: "Create Clips",
                description: "Make high-quality clips following campaign guidelines and requirements."
              },
              {
                step: 3,
                title: "Submit & Track", 
                description: "Submit your clips through CLIP platform and track performance in real-time."
              },
              {
                step: 4,
                title: "Earn Rewards",
                description: "Get paid through Whop based on views, engagement, and campaign goals."
              }
            ].map((step) => (
              <Card key={step.step} className="text-center hover-lift shadow-card">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{step.step}</span>
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl p-8">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Start Earning?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join active campaigns and turn your clipping skills into real rewards. The more viral your clips, the more you earn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                <Trophy className="w-5 h-5 mr-2" />
                Start Clipping
              </Button>
              <Button variant="outline" size="lg">
                Learn How to Clip
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Rewards;