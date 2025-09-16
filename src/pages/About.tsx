import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Mail, 
  FileText, 
  Shield,
  Zap,
  TrendingUp,
  Globe
} from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Coming Soon",
      role: "Founder & CEO", 
      bio: "Visionary leader connecting entertainment and finance.",
      avatar: "/placeholder.svg"
    },
    {
      name: "Coming Soon",
      role: "CTO",
      bio: "Technical architect building the future of creator economy.",
      avatar: "/placeholder.svg"
    },
    {
      name: "Coming Soon", 
      role: "Head of Community",
      bio: "Community builder fostering creator relationships.",
      avatar: "/placeholder.svg"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-gradient-rainbow">About CLIP</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Where entertainment becomes capital. We're building the future of creator economy.
          </p>
        </div>

        {/* Mission Statement */}
        <section className="text-center space-y-8">
          <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
            <CardContent className="p-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                Entertainment is capital. We transform viral moments into sustainable income, 
                connecting streamers, clippers, and audiences in a revolutionary creator economy 
                where everyone benefits from viral content.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* What We Do */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center">What We Do</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover-lift shadow-card text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We bridge the gap between streamers who create content and clippers who make it viral, 
                  creating a symbiotic ecosystem where both sides thrive.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift shadow-card text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Amplify</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Through coordinated RAIDCHAT activations and strategic clip distribution, 
                  we amplify reach and drive meaningful engagement across platforms.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift shadow-card text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle>Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We help pump.fun streamers scale their launches through our Launch Calendar 
                  and creator fee loop that compounds success into more opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Meet the Team</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="hover-lift shadow-card">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-4"></div>
                  <CardTitle>{member.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Vision */}
        <section className="space-y-8">
          <Card className="border-accent/20 bg-accent/5">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <h2 className="text-3xl font-bold">Our Vision</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  We envision a world where viral entertainment directly translates to financial success for creators. 
                  Where every laugh, every gasp, every moment of excitement becomes part of a sustainable creator economy 
                  that rewards both talent and the community that amplifies it.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact & Legal */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Contact & Legal</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-lift shadow-card text-center">
              <CardHeader>
                <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:hello@clip.app">
                    hello@clip.app
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift shadow-card text-center">
              <CardHeader>
                <Shield className="w-8 h-8 text-secondary mx-auto mb-2" />
                <CardTitle className="text-lg">DMCA</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dmca">
                    Report Content
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift shadow-card text-center">
              <CardHeader>
                <FileText className="w-8 h-8 text-accent mx-auto mb-2" />
                <CardTitle className="text-lg">Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <a href="/terms">
                    Terms of Service
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift shadow-card text-center">
              <CardHeader>
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://discord.gg/clip" target="_blank" rel="noopener noreferrer">
                    Join Discord
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Our Values</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gradient-primary">Transparency</h3>
              <p className="text-muted-foreground">
                We believe in open, honest communication about how our platform works, 
                how fees are distributed, and how decisions are made.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gradient-secondary">Community First</h3>
              <p className="text-muted-foreground">
                Our community of creators, clippers, and audiences drives everything we do. 
                Their success is our success.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gradient-accent">Innovation</h3>
              <p className="text-muted-foreground">
                We're constantly pushing boundaries to create new ways for creators 
                to monetize their content and grow their audiences.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gradient-rainbow">Sustainability</h3>
              <p className="text-muted-foreground">
                We build systems that create long-term value, not just quick wins. 
                Our creator economy is designed to compound and grow over time.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl p-8">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Join the Movement</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Be part of the revolution where entertainment becomes finance. 
              Whether you're a streamer, clipper, or agency, there's a place for you in our ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                Get Started Today
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="mailto:hello@clip.app">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Us
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;