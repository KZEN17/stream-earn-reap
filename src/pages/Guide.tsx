import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Download, 
  Wallet, 
  Coins,
  Video,
  Settings,
  Upload,
  Link,
  FileText,
  Star,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const Guide = () => {
  const guideSteps = [
    {
      step: 1,
      title: "Wallet Setup",
      icon: Wallet,
      description: "Create a crypto wallet (Phantom recommended) and secure your seed phrase.",
      details: [
        "Download Phantom wallet extension",
        "Create new wallet or import existing",
        "Securely store your seed phrase",
        "Add Solana network if needed"
      ]
    },
    {
      step: 2,
      title: "Create Token",
      icon: Coins,
      description: "Use pump.fun to create your token with compelling branding and story.",
      details: [
        "Visit pump.fun and connect wallet",
        "Design token logo and metadata", 
        "Write compelling token description",
        "Set initial parameters and launch"
      ]
    },
    {
      step: 3,
      title: "Stream Setup",
      icon: Video,
      description: "Configure your streaming platform and prepare for your launch event.",
      details: [
        "Set up Twitch/YouTube channel",
        "Create eye-catching stream title",
        "Plan launch event timing",
        "Prepare interactive content"
      ]
    },
    {
      step: 4,
      title: "OBS Configuration",
      icon: Settings,
      description: "Set up OBS with proper scenes, alerts, and overlays for professional streaming.",
      details: [
        "Download and install OBS Studio",
        "Configure video/audio settings",
        "Create scenes with overlays",
        "Test stream quality and alerts"
      ]
    },
    {
      step: 5,
      title: "Content Posting",
      icon: Upload,
      description: "Start posting engaging content across social platforms to build hype.",
      details: [
        "Create Twitter announcement thread",
        "Post token details and roadmap",
        "Share behind-the-scenes content",
        "Engage with crypto communities"
      ]
    },
    {
      step: 6,
      title: "Link to CLIP",
      icon: Link,
      description: "Connect your stream to CLIP platform for maximum clip distribution.",
      details: [
        "Sign up as streamer on CLIP",
        "Connect your streaming channels",
        "Create missions for clippers",
        "Set up reward parameters"
      ]
    },
    {
      step: 7,
      title: "Submit Clips",
      icon: FileText,
      description: "Work with our clipper network to create and distribute viral content.",
      details: [
        "Brief clippers on key moments",
        "Provide clip-worthy content during stream",
        "Review and approve submitted clips",
        "Share clips across social platforms"
      ]
    },
    {
      step: 8,
      title: "Get Featured", 
      icon: Star,
      description: "Qualify for featuring in CLIP's launch calendar and success stories.",
      details: [
        "Maintain consistent streaming schedule",
        "Generate engaging clip content",
        "Hit performance milestones",
        "Apply for calendar featuring"
      ]
    }
  ];

  const generatePDF = () => {
    // In a real app, this would generate an actual PDF
    // For now, we'll just show an alert
    alert("PDF download coming soon! For now, bookmark this page.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-gradient-rainbow">Launch Guide</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your complete guide to launching on pump.fun and connecting with CLIP
          </p>
          <Button variant="outline" onClick={generatePDF} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download PDF Guide</span>
          </Button>
        </div>

        {/* Overview */}
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <BookOpen className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold">Quick Start Overview</h2>
              </div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                This comprehensive guide will take you from token creation to viral content distribution. 
                Follow these 8 steps to maximize your launch success and tap into CLIP's creator economy.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-gradient-primary">~2 hours</div>
                  <div className="text-sm text-muted-foreground">Setup Time</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-gradient-secondary">8 steps</div>
                  <div className="text-sm text-muted-foreground">To Complete</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-gradient-accent">∞ potential</div>
                  <div className="text-sm text-muted-foreground">Earnings</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step-by-Step Guide */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Step-by-Step Guide</h2>
          
          <div className="space-y-6">
            {guideSteps.map((step, index) => (
              <Card key={step.step} className="hover-lift shadow-card">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Step {step.step}</Badge>
                        <CardTitle className="text-xl">{step.title}</CardTitle>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="ml-16">
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pro Tips */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Pro Tips for Success</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-primary" />
                  <span>Content Strategy</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Plan 3-5 "clip-worthy" moments per stream</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Coordinate with CLIP team for optimal timing</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Engage authentically with your audience</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>React dramatically to token price movements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 bg-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-secondary" />
                  <span>Technical Setup</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Test stream quality before launch event</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Set up price tracking overlays</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Configure donation/sub alerts</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Have backup streaming setup ready</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Success Metrics */}
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-2xl text-center">What Success Looks Like</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gradient-primary">10+</div>
                <div className="text-sm text-muted-foreground">Viral clips created</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gradient-secondary">$1K+</div>
                <div className="text-sm text-muted-foreground">Creator fees earned</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gradient-accent">500K+</div>
                <div className="text-sm text-muted-foreground">Total clip views</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl p-8">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Launch?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow this guide and join the ranks of successful pump.fun streamers earning through CLIP's ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                Start Your Launch
              </Button>
              <Button variant="outline" size="lg" onClick={generatePDF}>
                <Download className="w-5 h-5 mr-2" />
                Download PDF Guide
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Guide;