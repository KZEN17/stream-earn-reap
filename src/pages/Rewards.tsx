import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Clock, Users, Zap, Play, Gift, Star, Calendar, BookOpen, Filter, Plus, Award, RefreshCw, TrendingUp } from "lucide-react";
import { CampaignCard } from "@/components/rewards/CampaignCard";
import { CampaignDetail } from "@/components/rewards/CampaignDetail";
import { SubmissionModal } from "@/components/rewards/SubmissionModal";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Rewards = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('active');
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [submissionCampaignId, setSubmissionCampaignId] = useState<string>('');
  const [submissionCampaignTitle, setSubmissionCampaignTitle] = useState<string>('');
  
  const { campaigns, loading, error } = useCampaigns();
  const { toast } = useToast();

  // Categorize campaigns by status
  const categorizedCampaigns = {
    active: campaigns.filter(c => c.status === 'active'),
    upcoming: campaigns.filter(c => c.status === 'upcoming'),
    ended: campaigns.filter(c => c.status === 'ended' || c.status === 'completed')
  };

  const handleJoinCampaign = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      setSubmissionCampaignId(campaignId);
      setSubmissionCampaignTitle(campaign.title);
      setIsSubmissionModalOpen(true);
    }
  };

  const handleViewCampaign = (campaignId: string) => {
    setSelectedCampaign(campaignId);
  };

  const handleBackToCampaigns = () => {
    setSelectedCampaign(null);
  };

  if (error) {
    toast({
      title: "Error",
      description: error,
      variant: "destructive"
    });
  }

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
        <SubmissionModal
          isOpen={isSubmissionModalOpen}
          onClose={() => setIsSubmissionModalOpen(false)}
          campaignTitle={submissionCampaignTitle}
          campaignId={submissionCampaignId}
        />
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
                  <div className="text-2xl font-bold text-gradient-primary">$22K+</div>
                  <div className="text-sm text-muted-foreground">Total Rewards Pool</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-gradient-secondary">479+</div>
                  <div className="text-sm text-muted-foreground">Active Creators</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-gradient-accent">12</div>
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
                <span>Active ({categorizedCampaigns.active.length})</span>
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Upcoming ({categorizedCampaigns.upcoming.length})</span>
              </TabsTrigger>
              <TabsTrigger value="ended" className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>Ended ({categorizedCampaigns.ended.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-accent" />
                      Active Campaigns
                    </CardTitle>
                    <Badge variant="secondary">
                      {categorizedCampaigns.active.length} Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-64 w-full" />
                      ))}
                    </div>
                  ) : categorizedCampaigns.active.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No active campaigns at the moment</p>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                      {categorizedCampaigns.active.map((campaign) => (
                        <CampaignCard
                          key={campaign.id}
                          campaign={{
                            id: campaign.id,
                            title: campaign.title,
                            description: campaign.description || '',
                            rewardPool: campaign.prize_pool || 0,
                            participants: campaign.participants_count || 0,
                            maxParticipants: 500,
                            deadline: campaign.end_date || '',
                            status: campaign.status as 'active',
                            tags: campaign.tags || [],
                            progress: Math.min(((campaign.total_submissions || 0) / 100) * 100, 100),
                            pointsPerClip: campaign.payout_per_1000_views || 0,
                            maxPayout: campaign.max_payout_per_clip || 0,
                            requirements: []
                          }}
                          onJoin={handleJoinCampaign}
                          onView={handleViewCampaign}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Upcoming Campaigns
                    </CardTitle>
                    <Badge variant="outline">{categorizedCampaigns.upcoming.length} Coming Soon</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-64 w-full" />
                      ))}
                    </div>
                  ) : categorizedCampaigns.upcoming.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No upcoming campaigns scheduled</p>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                      {categorizedCampaigns.upcoming.map((campaign) => (
                        <CampaignCard
                          key={campaign.id}
                          campaign={{
                            id: campaign.id,
                            title: campaign.title,
                            description: campaign.description || '',
                            rewardPool: campaign.prize_pool || 0,
                            participants: campaign.participants_count || 0,
                            maxParticipants: 500,
                            deadline: campaign.end_date || '',
                            status: campaign.status as 'upcoming',
                            tags: campaign.tags || [],
                            progress: 0,
                            pointsPerClip: campaign.payout_per_1000_views || 0,
                            maxPayout: campaign.max_payout_per_clip || 0,
                            requirements: []
                          }}
                          onJoin={handleJoinCampaign}
                          onView={handleViewCampaign}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ended" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-muted-foreground" />
                      Past Campaigns
                    </CardTitle>
                    <Badge variant="secondary">{categorizedCampaigns.ended.length} Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-64 w-full" />
                      ))}
                    </div>
                  ) : categorizedCampaigns.ended.length === 0 ? (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No completed campaigns yet</p>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                      {categorizedCampaigns.ended.map((campaign) => (
                        <CampaignCard
                          key={campaign.id}
                          campaign={{
                            id: campaign.id,
                            title: campaign.title,
                            description: campaign.description || '',
                            rewardPool: campaign.prize_pool || 0,
                            participants: campaign.participants_count || 0,
                            maxParticipants: 500,
                            deadline: campaign.end_date || '',
                            status: campaign.status as 'ended',
                            tags: campaign.tags || [],
                            progress: 100,
                            pointsPerClip: campaign.payout_per_1000_views || 0,
                            maxPayout: campaign.max_payout_per_clip || 0,
                            requirements: []
                          }}
                          onJoin={handleJoinCampaign}
                          onView={handleViewCampaign}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
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