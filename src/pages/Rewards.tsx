import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Gift, 
  ExternalLink, 
  TrendingUp, 
  Target,
  Clock,
  Award,
  RefreshCw
} from "lucide-react";

const Rewards = () => {
  const activeCampaigns = [
    {
      id: 1,
      campaignTitle: "Holiday Clip Bonanza",
      brief: "Create viral holiday-themed clips from featured streamers and earn 2x points during December!",
      rewardPoints: 500,
      whopLink: "https://whop.com/clip-holiday-bonanza",
      deadline: "Dec 31, 2024",
      totalReward: "$2,500",
      participants: 234
    },
    {
      id: 2,
      campaignTitle: "New Year Token Launch Clips",
      brief: "Clip the best moments from upcoming New Year token launches. Top 10 clippers get exclusive NFT rewards.",
      rewardPoints: 750,
      whopLink: "https://whop.com/clip-new-year-tokens",
      deadline: "Jan 15, 2025", 
      totalReward: "$5,000",
      participants: 156
    },
    {
      id: 3,
      campaignTitle: "Epic Gaming Moments",
      brief: "Focus on incredible gaming plays and clutch moments. Weekly payouts for trending clips.",
      rewardPoints: 300,
      whopLink: "https://whop.com/clip-gaming-moments",
      deadline: "Ongoing",
      totalReward: "$1,000/week",
      participants: 445
    }
  ];

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

        {/* Whop Integration Intro */}
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-2">
                <Gift className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold">Powered by Whop</h2>
              </div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                All clipping rewards and campaigns are hosted securely on Whop's platform. 
                Participate in campaigns, track your progress, and claim rewards seamlessly.
              </p>
              <Button variant="hero" size="lg" asChild>
                <a 
                  href="https://whop.com/discover/content-rewards/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Open Rewards Hub</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Campaigns */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold flex items-center space-x-2">
            <Target className="w-8 h-8 text-primary" />
            <span>Active Campaigns</span>
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {activeCampaigns.map((campaign) => (
              <Card key={campaign.id} className="hover-lift shadow-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Badge variant="secondary" className="w-fit">
                        <Award className="w-3 h-3 mr-1" />
                        {campaign.rewardPoints} points
                      </Badge>
                      <CardTitle className="text-xl">{campaign.campaignTitle}</CardTitle>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-lg font-bold text-gradient-primary">
                        {campaign.totalReward}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Pool</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{campaign.brief}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{campaign.deadline}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span>{campaign.participants} participants</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    asChild
                  >
                    <a href={campaign.whopLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Go to Whop Campaign
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
              <Button variant="hero" size="lg" asChild>
                <a href="https://whop.com/discover/content-rewards/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Browse All Campaigns
                </a>
              </Button>
              <Button variant="outline" size="lg">
                Sign Up as Clipper
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Rewards;