import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Copy, 
  Check, 
  Palette, 
  FileImage, 
  Code, 
  Zap,
  Eye,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MediaPack = () => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (itemName: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedItem(itemName);
      toast({
        title: "Copied to clipboard!",
        description: `${itemName} copied successfully.`,
      });
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive"
      });
    }
  };

  const downloadAsset = (assetName: string) => {
    toast({
      title: "Download initiated",
      description: `${assetName} download will be available soon.`,
    });
  };

  const brandColors = [
    { name: "Pink Primary", hex: "#FF1B8D", description: "Primary actions & CTAs", usage: "Buttons, highlights, links" },
    { name: "Purple Secondary", hex: "#8B5FFF", description: "Secondary actions", usage: "Secondary buttons, badges" },
    { name: "Cyan Info", hex: "#00CFFF", description: "Information & highlights", usage: "Info states, focus rings" },
    { name: "Green Success", hex: "#3CFF88", description: "Success & earnings", usage: "Success states, earnings" },
    { name: "Yellow Warning", hex: "#E5FF00", description: "Warnings & alerts", usage: "Warning states, alerts" },
  ];

  const neutralColors = [
    { name: "Background", hex: "#0B0C0E", description: "Primary background" },
    { name: "Surface", hex: "#141518", description: "Card backgrounds" },
    { name: "Line", hex: "#1E2024", description: "Borders & dividers" },
    { name: "Text", hex: "#E6E7EA", description: "Primary text color" },
    { name: "Muted", hex: "#9CA3AF", description: "Secondary text" },
  ];

  const logoVariants = [
    { name: "Primary Logo", format: "SVG", size: "512x512", description: "Main logo with neon styling" },
    { name: "Logo Mark", format: "SVG", size: "256x256", description: "Icon only version" },
    { name: "Logo Dark", format: "PNG", size: "1024x1024", description: "Dark background version" },
    { name: "Logo Light", format: "PNG", size: "1024x1024", description: "Light background version" },
    { name: "Favicon", format: "ICO", size: "32x32", description: "Browser favicon" },
  ];

  const assets = [
    { name: "Background Patterns", format: "PNG", size: "1920x1080", description: "Neon grid backgrounds" },
    { name: "Gaming Icons", format: "SVG", size: "Various", description: "Gaming-themed iconset" },
    { name: "Neon Frames", format: "PNG", size: "Various", description: "Decorative neon frames" },
    { name: "Gradient Overlays", format: "PNG", size: "1920x1080", description: "Gradient overlay textures" },
  ];

  const codeSnippets = [
    {
      name: "CSS Custom Properties",
      language: "CSS",
      code: `:root {
  --pink: #FF1B8D;
  --purple: #8B5FFF;
  --cyan: #00CFFF;
  --green: #3CFF88;
  --yellow: #E5FF00;
  --bg: #0B0C0E;
  --surface: #141518;
  --line: #1E2024;
  --text: #E6E7EA;
  --muted: #9CA3AF;
}`
    },
    {
      name: "Neon Glow Effect",
      language: "CSS",
      code: `.neon-glow {
  box-shadow: 
    0 0 20px rgba(255, 27, 141, 0.4),
    0 0 40px rgba(255, 27, 141, 0.2);
  transition: all 0.3s ease;
}

.neon-glow:hover {
  box-shadow: 
    0 0 30px rgba(255, 27, 141, 0.6),
    0 0 60px rgba(255, 27, 141, 0.3);
}`
    },
    {
      name: "Gaming Button",
      language: "CSS",
      code: `.gaming-btn {
  background: linear-gradient(135deg, #FF1B8D, #8B5FFF);
  border: 2px solid rgba(255, 27, 141, 0.3);
  color: white;
  font-weight: 700;
  padding: 12px 24px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.gaming-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 27, 141, 0.6);
}`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black text-gradient-gaming font-display">
            MEDIA PACK
          </h1>
          <div className="flex items-center justify-center space-x-4">
            <div className="h-1 w-16 bg-gradient-primary rounded-full"></div>
            <div className="text-xl">🎨</div>
            <div className="h-1 w-16 bg-gradient-secondary rounded-full"></div>
          </div>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Complete brand assets, colors, and code snippets for the CLIP gaming platform.
        </p>
      </section>

      <Tabs defaultValue="colors" className="space-y-8">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="logos">Logos</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-8">
          {/* Neon Brand Colors */}
          <Card className="glass-primary">
            <CardHeader>
              <CardTitle className="heading-primary text-2xl flex items-center">
                <Palette className="w-6 h-6 mr-2 text-pink" />
                Neon Brand Palette
              </CardTitle>
              <CardDescription>
                Primary accent colors for the gaming platform aesthetic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brandColors.map((color, index) => (
                  <Card key={index} className="gaming-card hover-lift shadow-card">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div 
                          className="w-full h-24 rounded-xl border-2 border-white/10 shadow-lg"
                          style={{ backgroundColor: color.hex }}
                        ></div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg">{color.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(color.name, color.hex)}
                              className="text-xs"
                            >
                              {copiedItem === color.name ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          <p className="text-sm font-mono bg-surface/50 px-2 py-1 rounded">
                            {color.hex}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {color.description}
                          </p>
                          <p className="text-xs text-muted-foreground font-medium">
                            Usage: {color.usage}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Neutral Foundation */}
          <Card className="glass-secondary">
            <CardHeader>
              <CardTitle className="heading-secondary text-2xl">Neutral Foundation</CardTitle>
              <CardDescription>
                Base colors for backgrounds, text, and interface elements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {neutralColors.map((color, index) => (
                  <Card key={index} className="border-line/50 bg-surface/30 hover-lift">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div 
                          className="w-full h-16 rounded-lg border border-line"
                          style={{ backgroundColor: color.hex }}
                        ></div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{color.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(color.name, color.hex)}
                              className="text-xs"
                            >
                              {copiedItem === color.name ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          <p className="text-sm font-mono bg-bg/50 px-2 py-1 rounded">
                            {color.hex}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {color.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logos Tab */}
        <TabsContent value="logos" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <FileImage className="w-6 h-6 mr-2" />
                Logo Variations
              </CardTitle>
              <CardDescription>
                Official CLIP logos in various formats and configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {logoVariants.map((logo, index) => (
                  <Card key={index} className="hover-lift shadow-card">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="h-32 bg-gradient-to-r from-bg to-surface rounded-lg border border-line flex items-center justify-center">
                          <div className="text-2xl font-bold text-gradient-primary">CLIP</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{logo.name}</h3>
                            <div className="flex gap-2">
                              <Badge variant="outline">{logo.format}</Badge>
                              <Badge variant="outline">{logo.size}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{logo.description}</p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => downloadAsset(logo.name)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => copyToClipboard(`${logo.name} URL`, `https://clip.com/assets/${logo.name.toLowerCase().replace(' ', '-')}.${logo.format.toLowerCase()}`)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Brand Assets</CardTitle>
              <CardDescription>
                Additional graphics, patterns, and design elements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {assets.map((asset, index) => (
                  <Card key={index} className="hover-lift shadow-card">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="h-24 bg-gradient-to-r from-purple/10 to-pink/10 rounded-lg border border-line/50 flex items-center justify-center">
                          <FileImage className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{asset.name}</h3>
                            <div className="flex gap-2">
                              <Badge variant="outline">{asset.format}</Badge>
                              <Badge variant="outline">{asset.size}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{asset.description}</p>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => downloadAsset(asset.name)}
                            className="w-full"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Asset Pack
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Tab */}
        <TabsContent value="code" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Code className="w-6 h-6 mr-2" />
                Code Snippets
              </CardTitle>
              <CardDescription>
                Ready-to-use CSS and code for implementing the brand system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {codeSnippets.map((snippet, index) => (
                <Card key={index} className="border-line/50 bg-surface/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{snippet.name}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">{snippet.language}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(snippet.name, snippet.code)}
                        >
                          {copiedItem === snippet.name ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-bg/50 p-4 rounded-lg overflow-x-auto text-sm font-mono border border-line/30">
                      <code>{snippet.code}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guidelines Tab */}
        <TabsContent value="guidelines" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <BookOpen className="w-6 h-6 mr-2" />
                Brand Guidelines
              </CardTitle>
              <CardDescription>
                Rules and best practices for using CLIP brand assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Logo Usage */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gradient-primary">Logo Usage</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-green/20 bg-green/5">
                    <CardHeader>
                      <CardTitle className="text-lg text-green flex items-center">
                        <Check className="w-5 h-5 mr-2" />
                        Do's
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Use the logo on high contrast backgrounds</li>
                        <li>• Maintain minimum clear space around the logo</li>
                        <li>• Use provided color variations appropriately</li>
                        <li>• Scale proportionally when resizing</li>
                        <li>• Use SVG format when possible for scalability</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border-destructive/20 bg-destructive/5">
                    <CardHeader>
                      <CardTitle className="text-lg text-destructive">Don'ts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>• Don't alter the logo colors</li>
                        <li>• Don't distort or stretch the logo</li>
                        <li>• Don't add effects or filters to the logo</li>
                        <li>• Don't place on low contrast backgrounds</li>
                        <li>• Don't use outdated logo versions</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Color Usage */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gradient-secondary">Color Usage</h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-pink">Primary Actions</h4>
                        <p className="text-sm text-muted-foreground">
                          Use Pink (#FF1B8D) for primary buttons, links, and key interactive elements. 
                          This should be the most prominent color in any interface.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold text-green">Success & Earnings</h4>
                        <p className="text-sm text-muted-foreground">
                          Use Green (#3CFF88) for success states, earnings displays, and positive feedback. 
                          Perfect for showing rewards and achievements.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Accessibility */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gradient-accent">Accessibility</h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        All brand colors have been tested for WCAG AA compliance when used appropriately:
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Pink text on dark backgrounds meets AA standards</li>
                        <li>• Green provides excellent contrast for success states</li>
                        <li>• Cyan works well for information and focus indicators</li>
                        <li>• Always test color combinations before implementation</li>
                        <li>• Provide alternative indicators beyond color alone</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Download All */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Download Complete Media Pack</h2>
            <p className="text-muted-foreground">
              Get all brand assets, guidelines, and code snippets in one convenient package
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => downloadAsset("Complete Media Pack")}>
              <Download className="w-5 h-5 mr-2" />
              Download All Assets
            </Button>
            <Button size="lg" variant="outline">
              <ExternalLink className="w-5 h-5 mr-2" />
              View Online Guidelines
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaPack;