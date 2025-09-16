import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp,
  Eye,
  DollarSign,
  Users,
  Star,
  CheckCircle,
  Rocket,
  Trophy,
  ArrowLeft,
  ExternalLink,
  Play,
  Flame
} from "lucide-react";

const SuccessStories = () => {
  const navigate = useNavigate();

  const successStories = [
    {
      id: 1,
      streamerName: "Moon Master",
      streamerUsername: "@moonmaster",
      streamerAvatar: "/placeholder.svg",
      tokenName: "$MOON",
      tokenSymbol: "MOON",
      amountRaised: 125000,
      viewsGained: 250000,
      timeToGoal: "6 hours",
      quote: "Hit 25K views in 24h and community funded in record time!",
      fullStory: "Moon Master's $MOON token launch became the most successful stream of December. Starting with just 500 followers, the interactive launch format and community engagement led to massive organic growth. The token reached its funding goal in just 6 hours, with over 1,200 unique contributors participating in the pre-launch donations.",
      metrics: {
        peakViewers: 15000,
        totalClips: 47,
        communityGrowth: "+12,500 followers",
        tokenPerformance: "+340% first week"
      },
      streamLink: "https://twitch.tv/moonmaster",
      tokenLink: "https://pump.fun/moon"
    },
    {
      id: 2,
      streamerName: "Crypto Queen",
      streamerUsername: "@cryptoqueen",
      streamerAvatar: "/placeholder.svg",
      tokenName: "$DIAMOND",
      tokenSymbol: "DIAMOND",
      amountRaised: 89000,
      viewsGained: 180000,
      timeToGoal: "4 hours",
      quote: "Community funded in 10 minutes, most engaging stream ever!",
      fullStory: "Crypto Queen's Holiday Special became a viral sensation when her $DIAMOND token launch exceeded all expectations. The Christmas-themed interactive elements and surprise guest appearances created a perfect storm of engagement that had viewers glued to their screens.",
      metrics: {
        peakViewers: 12500,
        totalClips: 38,
        communityGrowth: "+8,900 followers",
        tokenPerformance: "+280% first week"
      },
      streamLink: "https://twitch.tv/cryptoqueen",
      tokenLink: "https://pump.fun/diamond"
    },
    {
      id: 3,
      streamerName: "Rocket Man",
      streamerUsername: "@rocketman",
      streamerAvatar: "/placeholder.svg",
      tokenName: "$ROCKET",
      tokenSymbol: "ROCKET",
      amountRaised: 67000,
      viewsGained: 145000,
      timeToGoal: "8 hours",
      quote: "Turned 2K followers into 15K overnight with one epic launch!",
      fullStory: "Starting as a small gaming streamer, Rocket Man's strategic approach to his $ROCKET launch transformed his entire streaming career. The space-themed launch with interactive mini-games and community challenges created unprecedented viewer retention and engagement.",
      metrics: {
        peakViewers: 9800,
        totalClips: 29,
        communityGrowth: "+13,000 followers",
        tokenPerformance: "+195% first week"
      },
      streamLink: "https://twitch.tv/rocketman",
      tokenLink: "https://pump.fun/rocket"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/calendar')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Calendar
          </Button>
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 text-accent" />
            <h1 className="text-4xl lg:text-5xl font-bold text-gradient-rainbow">Success Stories</h1>
            <Flame className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real streamers, real results. See how creators transformed their communities with token launches on our platform.
          </p>
        </div>

        {/* Success Stories Grid */}
        <div className="grid gap-8">
          {successStories.map((story) => (
            <Card key={story.id} className="hover-lift border-success/20 bg-gradient-to-r from-success/5 to-accent/5">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-success/30">
                      <AvatarImage src={story.streamerAvatar} alt={story.streamerName} />
                      <AvatarFallback className="bg-success/20">
                        {story.streamerName.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-bold">{story.streamerName}</h3>
                        <CheckCircle className="w-5 h-5 text-success" />
                      </div>
                      <p className="text-muted-foreground">{story.streamerUsername}</p>
                      <Badge variant="outline" className="mt-1 bg-success/10 text-success border-success/30">
                        <Rocket className="w-3 h-3 mr-1" />
                        Success Story
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-success">{story.tokenName}</div>
                    <div className="text-sm text-muted-foreground">Funded in {story.timeToGoal}</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Quote */}
                <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-success">
                  <p className="italic text-lg">"{story.quote}"</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">
                      ${(story.amountRaised / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Raised
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">
                      {(story.viewsGained / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      <Eye className="w-3 h-3" />
                      Views
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">
                      {(story.metrics.peakViewers / 1000).toFixed(1)}K
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      <Users className="w-3 h-3" />
                      Peak Viewers
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {story.metrics.totalClips}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                      <Star className="w-3 h-3" />
                      Clips Created
                    </div>
                  </div>
                </div>

                {/* Full Story */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">The Story</h4>
                  <p className="text-muted-foreground leading-relaxed">{story.fullStory}</p>
                </div>

                {/* Detailed Metrics */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-medium">Performance Highlights</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Community Growth:</span>
                        <span className="text-success font-medium">{story.metrics.communityGrowth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Token Performance:</span>
                        <span className="text-success font-medium">{story.metrics.tokenPerformance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time to Goal:</span>
                        <span className="text-accent font-medium">{story.timeToGoal}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium">Quick Links</h5>
                    <div className="space-y-2">
                      <Button size="sm" variant="outline" asChild className="w-full justify-start">
                        <a href={story.streamLink} target="_blank">
                          <Play className="w-3 h-3 mr-2" />
                          Watch Stream
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild className="w-full justify-start">
                        <a href={story.tokenLink} target="_blank">
                          <ExternalLink className="w-3 h-3 mr-2" />
                          View Token
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4 py-12">
          <h2 className="text-3xl font-bold">Ready to Write Your Success Story?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join these successful streamers and transform your community with an interactive token launch.
          </p>
          <Button
            onClick={() => navigate('/streamer-application')}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary-glow hover:to-secondary-glow text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-glow transition-all duration-300"
          >
            Start Your Launch Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;