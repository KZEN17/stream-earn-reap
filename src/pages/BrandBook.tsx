import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Copy, Check, Sparkles, Zap, Code2 } from 'lucide-react';
import { useState } from 'react';

const BrandBook = () => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const colors = [
    {
      name: 'Neon Pink',
      hex: '#FF1B8D',
      description: 'Primary accent, CTA buttons, active states',
      usage: 'Headers, primary buttons, key highlights',
      tailwind: 'pink'
    },
    {
      name: 'Neon Purple', 
      hex: '#8B5FFF',
      description: 'Secondary accent, card headers, special elements',
      usage: 'Secondary buttons, badges, decorative elements',
      tailwind: 'purple'
    },
    {
      name: 'Neon Cyan',
      hex: '#00CFFF', 
      description: 'Info states, highlights, links',
      usage: 'Information callouts, links, tech elements',
      tailwind: 'cyan'
    },
    {
      name: 'Neon Green',
      hex: '#3CFF88',
      description: 'Success states, earnings, positive values',
      usage: 'Success messages, profit indicators, achievements',
      tailwind: 'green'
    },
    {
      name: 'Neon Yellow',
      hex: '#E5FF00',
      description: 'Warnings, alerts, attention-grabbing elements',
      usage: 'Warning messages, urgent notifications, caution states',
      tailwind: 'yellow'
    }
  ];

  const neutrals = [
    {
      name: 'Background',
      hex: '#0B0C0E',
      description: 'Main background color',
      usage: 'Page backgrounds, dark containers',
      tailwind: 'bg'
    },
    {
      name: 'Surface',
      hex: '#141518',
      description: 'Card backgrounds, elevated surfaces', 
      usage: 'Cards, modals, dropdowns',
      tailwind: 'surface'
    },
    {
      name: 'Line',
      hex: '#1E2024',
      description: 'Borders, dividers, subtle separations',
      usage: 'Borders, hr elements, subtle dividers',
      tailwind: 'line'
    },
    {
      name: 'Text',
      hex: '#E6E7EA',
      description: 'Primary text color',
      usage: 'Headings, body text, main content',
      tailwind: 'text'
    },
    {
      name: 'Muted',
      hex: '#9CA3AF',
      description: 'Secondary text, placeholders',
      usage: 'Captions, placeholders, disabled states',
      tailwind: 'muted'
    }
  ];

  const copyToClipboard = (color: string, hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Sparkles className="h-8 w-8 text-pink" />
          <h1 className="heading-1 bg-gradient-pink-purple bg-clip-text text-transparent">
            Brand Book
          </h1>
        </div>
        <p className="body-large text-muted max-w-2xl mx-auto">
          Our modern design system built for speed, accessibility, and impact. 
          Each element serves a purpose in creating seamless digital experiences.
        </p>
      </div>

      {/* Logo System */}
      <section>
        <h2 className="heading-2 text-text mb-6 flex items-center space-x-2">
          <Zap className="text-pink" />
          <span>Logo System</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-default border-line">
            <CardHeader className="text-center pb-4">
              <CardTitle className="body-medium text-muted">Primary Logo</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-pink rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">C</span>
              </div>
              <div className="heading-3 bg-gradient-pink-purple bg-clip-text text-transparent">
                ClipStream
              </div>
            </CardContent>
          </Card>

          <Card className="card-default border-line">
            <CardHeader className="text-center pb-4">
              <CardTitle className="body-medium text-muted">Icon Only</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-pink rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">C</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-default border-line">
            <CardHeader className="text-center pb-4">
              <CardTitle className="body-medium text-muted">Monochrome</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-text rounded-xl flex items-center justify-center">
                <span className="text-bg font-bold text-2xl">C</span>
              </div>
              <div className="heading-3 text-text">
                ClipStream
              </div>
            </CardContent>
          </Card>

          <Card className="card-default border-line">
            <CardHeader className="text-center pb-4">
              <CardTitle className="body-medium text-muted">Favicon</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 bg-pink rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">C</span>
              </div>
              <span className="body-small text-muted">32x32px</span>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Neon Colors */}
      <section>
        <h2 className="heading-2 text-text mb-6 flex items-center space-x-2">
          <span className="text-pink">⚡</span>
          <span>Color Palette</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colors.map((color) => (
            <Card key={color.name} className="card-default border-line hover:border-pink/30 transition-all duration-300">
              <CardHeader className="pb-4">
                <div 
                  className="w-full h-24 rounded-xl mb-4 relative overflow-hidden group cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => copyToClipboard(color.name, color.hex)}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                    {copiedColor === color.name ? (
                      <Check className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" />
                    ) : (
                      <Copy className="h-6 w-6 text-white opacity-0 group-hover:opacity-100" />
                    )}
                  </div>
                  <div 
                    className="absolute inset-0 rounded-xl"
                    style={{ 
                      boxShadow: `0 0 30px ${color.hex}40`,
                      filter: 'blur(0px)'
                    }}
                  />
                </div>
                <CardTitle className="flex items-center justify-between">
                  <span className="heading-4 text-text">{color.name}</span>
                  <code className="body-xs bg-line px-2 py-1 rounded text-muted">
                    {color.tailwind}
                  </code>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="body-small font-mono text-muted">HEX</span>
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(color.name, color.hex)}
                    className="h-auto py-1 px-2 body-xs hover:bg-line"
                  >
                    {color.hex}
                    {copiedColor === color.name ? (
                      <Check className="h-3 w-3 ml-1" />
                    ) : (
                      <Copy className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                </div>
                <p className="body-small text-muted">{color.description}</p>
                <div className="body-xs text-muted">
                  <strong>Usage:</strong> {color.usage}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Typography Scale */}
      <section>
        <h2 className="heading-2 text-text mb-6 flex items-center space-x-2">
          <Code2 className="text-purple" />
          <span>Typography Scale</span>
        </h2>
        <Card className="card-default border-line">
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <h1 className="heading-1">Heading 1</h1>
                  <p className="body-small text-muted mt-2">Space Grotesk • 40px/48px • Bold • Uppercase</p>
                </div>
                <code className="body-xs bg-line px-3 py-1 rounded text-muted">.heading-1</code>
              </div>
              
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <h2 className="heading-2">Heading 2</h2>
                  <p className="body-small text-muted mt-2">Space Grotesk • 32px/40px • Bold</p>
                </div>
                <code className="body-xs bg-line px-3 py-1 rounded text-muted">.heading-2</code>
              </div>
              
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <h3 className="heading-3">Heading 3</h3>
                  <p className="body-small text-muted mt-2">Space Grotesk • 24px/32px • Semibold</p>
                </div>
                <code className="body-xs bg-line px-3 py-1 rounded text-muted">.heading-3</code>
              </div>
              
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <h4 className="heading-4">Heading 4</h4>
                  <p className="body-small text-muted mt-2">Space Grotesk • 20px/28px • Medium</p>
                </div>
                <code className="body-xs bg-line px-3 py-1 rounded text-muted">.heading-4</code>
              </div>
              
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <p className="body-large">Body Large</p>
                  <p className="body-small text-muted mt-2">Inter • 18px/28px • Regular</p>
                </div>
                <code className="body-xs bg-line px-3 py-1 rounded text-muted">.body-large</code>
              </div>
              
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <p className="body-medium">Body Medium</p>
                  <p className="body-small text-muted mt-2">Inter • 16px/24px • Regular</p>
                </div>
                <code className="body-xs bg-line px-3 py-1 rounded text-muted">.body-medium</code>
              </div>
              
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <p className="body-small">Body Small</p>
                  <p className="body-small text-muted mt-2">Inter • 14px/20px • Regular</p>
                </div>
                <code className="body-xs bg-line px-3 py-1 rounded text-muted">.body-small</code>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-xs">Body XS</p>
                  <p className="body-small text-muted mt-2">Inter • 12px/16px • Regular</p>
                </div>
                <code className="body-xs bg-line px-3 py-1 rounded text-muted">.body-xs</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Gradients */}
      <section>
        <h2 className="heading-2 text-text mb-6">Brand Gradients</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: 'Pink to Purple', class: 'bg-gradient-pink-purple', css: 'linear-gradient(90deg, #FF1B8D 0%, #8B5FFF 100%)' },
            { name: 'Purple to Blue', class: 'bg-gradient-purple-blue', css: 'linear-gradient(90deg, #8B5FFF 0%, #00CFFF 100%)' },
            { name: 'Magenta to Cyan', class: 'bg-gradient-magenta-cyan', css: 'linear-gradient(90deg, #FF1B8D 0%, #00CFFF 100%)' },
            { name: 'Rainbow Glow', class: 'bg-gradient-rainbow', css: 'linear-gradient(90deg, #FF1B8D, #8B5FFF, #00CFFF)' }
          ].map((gradient) => (
            <Card key={gradient.name} className="card-default border-line">
              <CardContent className="p-6">
                <div className={`w-full h-20 rounded-xl mb-4 ${gradient.class}`}></div>
                <div className="space-y-2">
                  <h4 className="heading-4 text-text">{gradient.name}</h4>
                  <div className="flex items-center justify-between">
                    <code className="body-xs text-muted">{gradient.class}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(gradient.name, gradient.css)}
                      className="body-xs"
                    >
                      Copy CSS
                      {copiedColor === gradient.name ? (
                        <Check className="h-3 w-3 ml-1" />
                      ) : (
                        <Copy className="h-3 w-3 ml-1" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {neutrals.map((color) => (
            <Card key={color.name} className="bg-surface border-line hover:border-muted/50 transition-all duration-300">
              <CardHeader className="pb-4">
                <div 
                  className="w-full h-20 rounded-lg mb-4 border border-line relative overflow-hidden group cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => copyToClipboard(color.name, color.hex)}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-200 flex items-center justify-center">
                    {copiedColor === color.name ? (
                      <Check className="h-5 w-5 text-white opacity-0 group-hover:opacity-100" />
                    ) : (
                      <Copy className="h-5 w-5 text-white opacity-0 group-hover:opacity-100" />
                    )}
                  </div>
                </div>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-text">{color.name}</span>
                  <code className="text-xs bg-line px-2 py-1 rounded text-muted">
                    {color.tailwind}
                  </code>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-muted">HEX</span>
                  <Button
                    variant="ghost"
                    size="sm" 
                    onClick={() => copyToClipboard(color.name, color.hex)}
                    className="h-auto py-1 px-2 text-xs hover:bg-line"
                  >
                    {color.hex}
                    {copiedColor === color.name ? (
                      <Check className="h-3 w-3 ml-1" />
                    ) : (
                      <Copy className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted">{color.description}</p>
                <div className="text-xs text-muted">
                  <strong>Usage:</strong> {color.usage}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Usage Examples */}
      <section>
        <h2 className="text-2xl font-bold text-text mb-6">Usage Examples</h2>
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Buttons */}
          <Card className="bg-surface border-line">
            <CardHeader>
              <CardTitle className="text-purple">Button Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="bg-pink hover:bg-pink/80 text-white w-full">
                Primary CTA
              </Button>
              <Button className="bg-purple hover:bg-purple/80 text-white w-full">
                Secondary Action
              </Button>
              <Button className="bg-green hover:bg-green/80 text-bg w-full">
                Success Action
              </Button>
              <Button className="bg-yellow hover:bg-yellow/80 text-bg w-full">
                Warning Action
              </Button>
            </CardContent>
          </Card>

          {/* Status Indicators */}
          <Card className="bg-surface border-line">
            <CardHeader>
              <CardTitle className="text-cyan">Status Indicators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green rounded-full"></div>
                <span className="text-green">Success: Transaction completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow rounded-full"></div>
                <span className="text-yellow">Warning: Low balance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyan rounded-full"></div>
                <span className="text-cyan">Info: New feature available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink rounded-full"></div>
                <span className="text-pink">Active: Currently streaming</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Guidelines */}
      <section>
        <Card className="bg-surface border-line">
          <CardHeader>
            <CardTitle className="text-text">Design Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-pink mb-2">Do's</h4>
                <ul className="space-y-1 text-sm text-muted">
                  <li>• Use neon colors sparingly for maximum impact</li>
                  <li>• Apply glow effects to active/interactive elements</li>
                  <li>• Maintain sufficient contrast for accessibility</li>
                  <li>• Use consistent color meanings (green = success, etc.)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-yellow mb-2">Don'ts</h4>
                <ul className="space-y-1 text-sm text-muted">
                  <li>• Don't use multiple neon colors together without purpose</li>
                  <li>• Avoid overusing bright colors for text readability</li>
                  <li>• Don't ignore the neutral palette - it provides balance</li>
                  <li>• Avoid mixing our neon palette with other bright colors</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default BrandBook;