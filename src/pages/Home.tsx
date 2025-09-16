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

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="absolute inset-0 bg-gradient-rainbow opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold">
                <span className="text-gradient-rainbow">Clip. Share. Earn.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Entertainment becomes finance. From Twitch to Rich.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                <Play className="w-5 h-5 mr-2" />
                Start Clipping
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Users className="w-5 h-5 mr-2" />
                Apply as Streamer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover-lift shadow-card">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Clip & Earn</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create viral clips from live streams and earn rewards based on views and engagement.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift shadow-card">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Stream & Scale</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Amplify your content reach through our clipper network and grow your audience exponentially.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift shadow-card">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-accent-foreground" />
              </div>
              <CardTitle>Finance the Fun</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Turn entertainment into sustainable income through our innovative creator economy.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground">Two simple paths to success</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* For Clippers */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gradient-primary">For Clippers</h3>
            <div className="space-y-4">
              {[
                "Find trending streams and missions",
                "Create and submit viral clips",
                "Earn points and token rewards"
              ].map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-muted-foreground pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* For Streamers */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gradient-secondary">For Streamers</h3>
            <div className="space-y-4">
              {[
                "Connect your channels and create missions",
                "Stream and engage with your audience", 
                "Watch your content spread and earn fees"
              ].map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-muted-foreground pt-1">{step}</p>
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
                <div className="text-sm text-muted-foreground">To Talent</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gradient-rainbow">$2,500</div>
                <div className="text-sm text-muted-foreground">To Audience</div>
              </div>
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
              views: "500K", 
              period: "Last 30 days",
              story: "Launched on pump.fun and immediately connected with CLIP. Now earning consistent fees from viral clips."
            },
            { 
              name: "CryptoQueen", 
              fees: "$1,800",
              views: "380K", 
              period: "Last 30 days",
              story: "Grew from 100 to 10K followers through strategic clip distribution and community building."
            },
            { 
              name: "PumpMaster", 
              fees: "$3,200",
              views: "720K", 
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-gradient-primary">{story.fees}</div>
                      <div className="text-sm text-muted-foreground">Fees Earned</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gradient-secondary">{story.views}</div>
                    </div>
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
                  <Button size="sm" variant="outline" className="w-full">
                    Set Reminder
                  </Button>
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
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                <Play className="w-5 h-5 mr-2" />
                Start Clipping Now
              </Button>
              <Button variant="secondary" size="lg" className="text-lg px-8 py-6">
                <Users className="w-5 h-5 mr-2" />
                Apply as Streamer
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;