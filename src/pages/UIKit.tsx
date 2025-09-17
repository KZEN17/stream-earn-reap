import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Copy, 
  Check, 
  Zap, 
  Trophy, 
  Settings, 
  Bell,
  Star,
  Heart,
  Download,
  Upload,
  Search,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UIKit = () => {
  const [copiedComponent, setCopiedComponent] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (componentName: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedComponent(componentName);
      toast({
        title: "Copied to clipboard!",
        description: `${componentName} component code copied successfully.`,
      });
      setTimeout(() => setCopiedComponent(null), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy component code to clipboard.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black text-gradient-gaming font-display">
            UI KIT
          </h1>
          <div className="flex items-center justify-center space-x-4">
            <div className="h-1 w-16 bg-gradient-primary rounded-full"></div>
            <div className="text-xl">⚡</div>
            <div className="h-1 w-16 bg-gradient-secondary rounded-full"></div>
          </div>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Interactive showcase of our neon gaming UI components. Copy, customize, and build amazing interfaces.
        </p>
      </section>

      <Tabs defaultValue="buttons" className="space-y-8">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>

        {/* Buttons Tab */}
        <TabsContent value="buttons" className="space-y-8">
          <Card className="glass-primary">
            <CardHeader>
              <CardTitle className="heading-primary text-2xl">Button Variants</CardTitle>
              <CardDescription>
                Primary action buttons with neon gaming aesthetics and hover effects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Primary Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gradient-primary">Primary Actions</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default">
                    <Play className="w-4 h-4 mr-2" />
                    Default Pink
                  </Button>
                  <Button variant="hero">
                    <Zap className="w-4 h-4 mr-2" />
                    Hero Gradient
                  </Button>
                  <Button variant="primary">
                    <Trophy className="w-4 h-4 mr-2" />
                    Primary Pink
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard("Primary Button", `<Button variant="default">\n  <Play className="w-4 h-4 mr-2" />\n  Default Pink\n</Button>`)}
                  className="text-xs"
                >
                  {copiedComponent === "Primary Button" ? (
                    <Check className="w-3 h-3 mr-1" />
                  ) : (
                    <Copy className="w-3 h-3 mr-1" />
                  )}
                  Copy Code
                </Button>
              </div>

              {/* Secondary Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gradient-secondary">Secondary Actions</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="secondary">
                    <Settings className="w-4 h-4 mr-2" />
                    Purple Secondary
                  </Button>
                  <Button variant="outline">
                    <Bell className="w-4 h-4 mr-2" />
                    Outline
                  </Button>
                  <Button variant="ghost">
                    <Search className="w-4 h-4 mr-2" />
                    Ghost
                  </Button>
                </div>
              </div>

              {/* Status Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gradient-accent">Status & Feedback</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="success">
                    <Check className="w-4 h-4 mr-2" />
                    Success Green
                  </Button>
                  <Button variant="warning">
                    <Bell className="w-4 h-4 mr-2" />
                    Warning Yellow
                  </Button>
                  <Button variant="info">
                    <Star className="w-4 h-4 mr-2" />
                    Info Cyan
                  </Button>
                  <Button variant="destructive">
                    <Heart className="w-4 h-4 mr-2" />
                    Destructive
                  </Button>
                </div>
              </div>

              {/* Button Sizes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Button Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm" variant="secondary">Small</Button>
                  <Button size="default" variant="secondary">Default</Button>
                  <Button size="lg" variant="secondary">Large</Button>
                  <Button size="icon" variant="secondary">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inputs Tab */}
        <TabsContent value="inputs" className="space-y-8">
          <Card className="glass-secondary">
            <CardHeader>
              <CardTitle className="heading-secondary text-2xl">Input Components</CardTitle>
              <CardDescription>
                Form inputs with neon focus states and validation styling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Text Inputs */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gradient-primary">Text Inputs</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      placeholder="Enter your username"
                      className="focus:ring-cyan focus:border-cyan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email"
                      className="focus:ring-cyan focus:border-cyan"
                    />
                  </div>
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gradient-secondary">Textarea</h3>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Tell us about your content..."
                    rows={4}
                    className="focus:ring-cyan focus:border-cyan"
                  />
                </div>
              </div>

              {/* Switches */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gradient-accent">Switches & Toggles</h3>
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" />
                  <Label htmlFor="notifications">Enable notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-submit" defaultChecked />
                  <Label htmlFor="auto-submit">Auto-submit clips</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-8">
          <Card className="glass-accent">
            <CardHeader>
              <CardTitle className="heading-accent text-2xl">Feedback Components</CardTitle>
              <CardDescription>
                Status indicators, progress bars, and user feedback elements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Badges */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gradient-primary">Status Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-pink text-white">Primary</Badge>
                  <Badge className="bg-purple text-white">Secondary</Badge>
                  <Badge className="bg-green text-bg">Success</Badge>
                  <Badge className="bg-yellow text-bg">Warning</Badge>
                  <Badge className="bg-cyan text-white">Info</Badge>
                  <Badge variant="outline" className="border-pink text-pink">Outline</Badge>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gradient-secondary">Progress Indicators</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Campaign Progress (75%)</Label>
                    <Progress value={75} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <Label>Upload Progress (45%)</Label>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <Label>Animated Progress</Label>
                    <Progress value={60} animated className="h-4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation Tab */}
        <TabsContent value="navigation" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Navigation Components</CardTitle>
              <CardDescription>
                Tabs, breadcrumbs, and navigation elements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Tabs Example */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tab Navigation</h3>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="mt-4 p-4 bg-surface/30 rounded-lg">
                    <p className="text-muted-foreground">Overview content goes here...</p>
                  </TabsContent>
                  <TabsContent value="analytics" className="mt-4 p-4 bg-surface/30 rounded-lg">
                    <p className="text-muted-foreground">Analytics content goes here...</p>
                  </TabsContent>
                  <TabsContent value="campaigns" className="mt-4 p-4 bg-surface/30 rounded-lg">
                    <p className="text-muted-foreground">Campaigns content goes here...</p>
                  </TabsContent>
                  <TabsContent value="settings" className="mt-4 p-4 bg-surface/30 rounded-lg">
                    <p className="text-muted-foreground">Settings content goes here...</p>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Display Components</CardTitle>
              <CardDescription>
                Cards, avatars, and content display elements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Gaming Cards */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gradient-primary">Gaming Cards</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="gaming-card hover-float">
                    <CardHeader>
                      <CardTitle className="text-gradient-primary">Primary Card</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Content with gaming aesthetics</p>
                    </CardContent>
                  </Card>
                  <Card className="glass-primary hover-lift">
                    <CardHeader>
                      <CardTitle className="text-gradient-secondary">Glass Effect</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Glassmorphism design</p>
                    </CardContent>
                  </Card>
                  <Card className="border-pink/20 bg-surface/50">
                    <CardHeader>
                      <CardTitle className="text-gradient-accent">Neon Border</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Subtle neon accents</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Layout Components</CardTitle>
              <CardDescription>
                Grids, containers, and layout utilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Grid Examples */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Grid Layouts</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-semibold">
                      Grid {i}
                    </div>
                  ))}
                </div>
              </div>

              {/* Flex Examples */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Flex Layouts</h3>
                <div className="flex gap-4">
                  <div className="flex-1 h-16 bg-gradient-secondary rounded-lg flex items-center justify-center text-white font-semibold">
                    Flex 1
                  </div>
                  <div className="flex-2 h-16 bg-gradient-accent rounded-lg flex items-center justify-center text-white font-semibold">
                    Flex 2
                  </div>
                  <div className="flex-1 h-16 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-semibold">
                    Flex 3
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Usage Guidelines */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Usage Guidelines</CardTitle>
          <CardDescription>
            Best practices for implementing the CLIP neon gaming UI system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gradient-primary">✅ Do's</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use pink for primary actions and CTAs</li>
                <li>• Apply green for success states and earnings</li>
                <li>• Use cyan for information and highlights</li>
                <li>• Keep purple for secondary actions</li>
                <li>• Use yellow sparingly for warnings</li>
                <li>• Maintain proper contrast ratios</li>
                <li>• Apply hover effects consistently</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gradient-destructive">❌ Don'ts</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Don't use colors outside the neon palette</li>
                <li>• Avoid overusing neon effects</li>
                <li>• Don't ignore accessibility guidelines</li>
                <li>• Don't mix too many bright colors</li>
                <li>• Avoid low contrast combinations</li>
                <li>• Don't skip hover states</li>
                <li>• Avoid inconsistent spacing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UIKit;