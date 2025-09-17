import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Play, 
  TrendingUp, 
  Zap, 
  Trophy, 
  ArrowRight, 
  Users, 
  DollarSign,
  Calendar,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

import { SocialProofCounter, FollowCreatorButton } from "@/components/features/ViralFeatures";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center space-y-10 max-w-5xl mx-auto">
            <div className="space-y-8">
              <h1 className="text-7xl md:text-9xl font-black text-gradient-gaming font-display animate-stagger leading-none tracking-tight">
                FROM TWITCH TO RICH
              </h1>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="h-1 w-20 bg-gradient-primary rounded-full animate-pulse-glow"></div>
                <div className="text-2xl">🎮</div>
                <div className="h-1 w-20 bg-gradient-secondary rounded-full animate-pulse-glow"></div>
              </div>
              <p className="text-2xl md:text-3xl text-foreground/90 max-w-3xl mx-auto leading-relaxed font-semibold">
                Turn <span className="text-gradient-primary font-bold">entertainment</span> into <span className="text-gradient-secondary font-bold">finance</span>. 
                Connect <span className="text-gradient-accent font-bold">streamers</span>, clippers, and agencies.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Button 
                variant="hero" 
                size="lg" 
                className="text-2xl px-16 py-10 glow-primary font-black hover-lift animate-pulse-glow bg-gradient-primary shadow-glow-primary border-2 border-primary/30"
                onClick={() => navigate('/rewards')}
              >
                <Play className="w-10 h-10 mr-6 animate-float" />
                START CLIPPING NOW
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                className="text-2xl px-16 py-10 glow-secondary font-black hover-lift animate-pulse-glow bg-gradient-secondary shadow-glow-secondary border-2 border-secondary/30"
                onClick={() => navigate('/calendar')}
              >
                <Users className="w-10 h-10 mr-6 animate-float" />
                START STREAMING NOW
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 heading-secondary">Platform Growth</h2>
          <p className="text-xl text-muted-foreground">Real numbers from our thriving creator economy</p>
        </div>
        <SocialProofCounter />
      </section>

      {/* Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover-float interactive glass-primary">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 glow-primary">
                <Play className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="heading-secondary text-2xl">Stream • Clip • Earn $</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70 text-lg leading-relaxed">
                Create viral clips from live streams and earn rewards based on views and engagement.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-float interactive glass-secondary">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mb-6 glow-secondary">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="heading-secondary text-2xl text-secondary">Loop Rewards & Grow</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70 text-lg leading-relaxed">
                Recycle hype, multiply rewards
              </p>
            </CardContent>
          </Card>

          <Card className="hover-float interactive glass-accent">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mb-6 glow-accent">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="heading-secondary text-2xl text-accent">Entertainment Finance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70 text-lg leading-relaxed">
                Turn entertainment into sustainable income as innovative creator
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black mb-6 heading-primary">HOW IT WORKS</h2>
          <p className="text-xl text-foreground/80 font-medium">Three paths to dominate the battlefield</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* For Clippers */}
          <div className="gaming-card p-8 space-y-6">
            <h3 className="text-3xl font-black text-gradient-primary uppercase tracking-wide">For Clippers</h3>
            <div className="space-y-6">
              {[
                "Find trending streamer and missions",
                "Create and submit viral clips",
                "Earn rewards"
              ].map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold shadow-glow flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-foreground/90 pt-2 font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* For Streamers */}
          <div className="gaming-card p-8 space-y-6">
            <h3 className="text-3xl font-black text-gradient-primary uppercase tracking-wide">For Streamers</h3>
            <div className="space-y-6">
              {[
                "Connect your channels to Pumpfun and create missions",
                "Stream and engage with your audience", 
                "Watch your content spread and earn fees"
              ].map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center text-white font-bold shadow-neon flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-foreground/90 pt-2 font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div className="gaming-card p-8 space-y-6">
            <h3 className="text-3xl font-black text-gradient-accent uppercase tracking-wide">Platform</h3>
            <div className="space-y-6">
              {[
                "Token buys fuel reach and visibility.",
                "Bigger community support = stronger launch outcome.",
                "Every contribution amplifies streams to new audiences."
              ].map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center text-accent-foreground font-bold shadow-neon flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-foreground/90 pt-2 font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Creator Fee Loop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl lg:text-3xl">$CLIP Creator Fee Loop</CardTitle>
            <p className="text-muted-foreground">Every fee compounds into more reach, more clips, more value.</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gradient-primary">$12,500</div>
                <div className="text-sm text-muted-foreground">Total Fees</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gradient-secondary">$6,250</div>
                <div className="text-sm text-muted-foreground">To Streamers</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gradient-accent">$3,750</div>
                <div className="text-sm text-muted-foreground">To Clipper</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gradient-rainbow">$2,500</div>
                <div className="text-sm text-muted-foreground">To Mission</div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                We take 0% Fees 0% allocation except running infra cost
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Live Leaderboards Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold">Live Leaderboards</h2>
          <Link to="/leaderboards">
            <Button variant="outline">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Top Clippers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-secondary" />
                Top Clippers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { handle: "@clipmaster", rewards: "$1,225" },
                { handle: "@viralking", rewards: "$1,065" },
                { handle: "@contentcreator", rewards: "$945" },
              ].map((clipper, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-secondary rounded-full"></div>
                    <span className="font-medium text-sm">{clipper.handle}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{clipper.rewards}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Streamers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-accent" />
                Top Streamers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { handle: "@pumpstreamer", fees: "$1,250" },
                { handle: "@cryptoking", fees: "$980" },
                { handle: "@tokenmaster", fees: "$750" },
              ].map((earner, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-accent rounded-full"></div>
                    <span className="font-medium text-sm">{earner.handle}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{earner.fees}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Success Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-xl text-muted-foreground">Onboarded pump.fun streamers crushing it</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              name: "TokenKing", 
              fees: "$2,500",
              period: "Last 30 days",
              story: "Launched on pump.fun and immediately connected with CLIP. Now earning consistent fees from viral clips."
            },
            { 
              name: "CryptoQueen", 
              fees: "$1,800",
              period: "Last 30 days",
              story: "Grew from 100 to 10K followers through strategic clip distribution and community building."
            },
            { 
              name: "PumpMaster", 
              fees: "$3,200",
              period: "Last 30 days",
              story: "Multiple viral clips led to massive token launches and sustainable creator economy."
            }
          ].map((story, index) => (
            <Card key={index} className="hover-lift shadow-card">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{story.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{story.period}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gradient-primary">{story.fees}</div>
                    <div className="text-sm text-muted-foreground">Fees Earned</div>
                  </div>
                  <p className="text-sm text-muted-foreground">{story.story}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Launch Calendar Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold">Upcoming Launches</h2>
          <Link to="/calendar">
            <Button variant="outline">
              View Calendar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { 
              title: "$MOON Token Launch",
              date: "Dec 20, 2024",
              time: "2:00 PM EST",
              streamer: "@moonmaster"
            },
            { 
              title: "$ROCKET Stream Event",
              date: "Dec 22, 2024", 
              time: "6:00 PM EST",
              streamer: "@rocketman"
            },
            { 
              title: "$DIAMOND Launch Party",
              date: "Dec 25, 2024",
              time: "8:00 PM EST", 
              streamer: "@cryptoqueen"
            }
          ].map((launch, index) => (
            <Card key={index} className="hover-lift shadow-card">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">{launch.date}</span>
                </div>
                <CardTitle className="text-lg">{launch.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-muted-foreground">{launch.time}</p>
                  <p className="text-sm font-medium">{launch.streamer}</p>
                  <div className="flex space-x-2">
                    <FollowCreatorButton 
                      creatorId={launch.streamer} 
                      creatorName={launch.streamer} 
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => navigate('/calendar')}
                    >
                      Set Reminder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the revolution where entertainment becomes finance. Choose your path and start earning today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/rewards')}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Clipping Now
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/calendar')}
              >
                <Users className="w-5 h-5 mr-2" />
                Start Streaming
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;