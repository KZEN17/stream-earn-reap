import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Box,
  Palette, 
  Type, 
  MousePointer, 
  ToggleLeft,
  Tag,
  BarChart3,
  List,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle
} from 'lucide-react';

const UIKit = () => {
  const [progress, setProgress] = useState(65);
  const [switchStates, setSwitchStates] = useState({
    notifications: true,
    marketing: false,
    analytics: true
  });

  const components = [
    {
      name: 'Buttons',
      icon: MousePointer,
      component: (
        <div className="space-y-4">
          <div className="space-y-3">
            <h4 className="heading-4 text-text">Button Variants</h4>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-pink hover:bg-pink/80 text-white">Primary</Button>
              <Button className="border border-purple text-purple hover:bg-purple/10 bg-transparent">Secondary</Button>
              <Button variant="ghost" className="text-muted hover:text-text">Tertiary</Button>
              <Button className="bg-green hover:bg-green/80 text-bg">Success</Button>
              <Button className="bg-yellow hover:bg-yellow/80 text-bg">Warning</Button>
              <Button className="bg-cyan hover:bg-cyan/80 text-white">Info</Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="heading-4 text-text">Button Sizes</h4>
            <div className="flex items-center gap-3">
              <Button size="sm" className="bg-pink hover:bg-pink/80 text-white">Small</Button>
              <Button className="bg-pink hover:bg-pink/80 text-white">Default</Button>
              <Button size="lg" className="bg-pink hover:bg-pink/80 text-white">Large</Button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="heading-4 text-text">Button States</h4>
            <div className="flex gap-3">
              <Button className="bg-pink hover:bg-pink/80 text-white">Normal</Button>
              <Button className="bg-pink hover:bg-pink/80 text-white" disabled>Disabled</Button>
            </div>
          </div>
        </div>
      )
    },
    {
      name: 'Inputs',
      icon: Type,
      component: (
        <div className="space-y-4 max-w-sm">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-text">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email"
              className="bg-surface border-line text-text placeholder:text-muted focus:ring-2 focus:ring-cyan focus:border-cyan"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-text">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter password"
              className="bg-surface border-line text-text placeholder:text-muted focus:ring-2 focus:ring-cyan focus:border-cyan"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="disabled" className="text-muted">Disabled Input</Label>
            <Input 
              id="disabled" 
              disabled 
              placeholder="Disabled input"
              className="bg-surface border-line text-muted placeholder:text-muted opacity-60"
            />
          </div>
        </div>
      )
    },
    {
      name: 'Select',
      icon: List,
      component: (
        <div className="space-y-4 max-w-sm">
          <div className="space-y-2">
            <Label className="text-text">Framework</Label>
            <Select>
              <SelectTrigger className="bg-surface border-line text-text focus:ring-2 focus:ring-cyan">
                <SelectValue placeholder="Select a framework" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-line">
                <SelectItem value="react" className="text-text hover:bg-line">React</SelectItem>
                <SelectItem value="vue" className="text-text hover:bg-line">Vue</SelectItem>
                <SelectItem value="angular" className="text-text hover:bg-line">Angular</SelectItem>
                <SelectItem value="svelte" className="text-text hover:bg-line">Svelte</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
    {
      name: 'Toggles',
      icon: ToggleLeft,
      component: (
        <div className="space-y-4">
          <div className="space-y-3">
            {Object.entries(switchStates).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-3">
                <Switch 
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) => 
                    setSwitchStates(prev => ({ ...prev, [key]: checked }))
                  }
                  className="data-[state=checked]:bg-green"
                />
                <Label htmlFor={key} className="text-text capitalize">
                  {key}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      name: 'Badges',
      icon: Tag,
      component: (
        <div className="space-y-4">
          <div className="space-y-3">
            <h4 className="heading-4 text-text">Badge Variants</h4>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-pink text-white">Primary</Badge>
              <Badge className="bg-purple text-white">Secondary</Badge>
              <Badge className="bg-green text-bg">Success</Badge>
              <Badge className="bg-yellow text-bg">Warning</Badge>
              <Badge className="bg-cyan text-white">Info</Badge>
              <Badge variant="outline" className="border-line text-muted">Outline</Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="heading-4 text-text">Status Badges</h4>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-green text-bg">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
              <Badge className="bg-yellow text-bg">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Pending
              </Badge>
              <Badge className="bg-line text-muted">
                Inactive
              </Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      name: 'Progress',
      icon: BarChart3,
      component: (
        <div className="space-y-4">
          <div className="space-y-3">
            <h4 className="heading-4 text-text">Linear Progress</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm text-muted mb-2">
                  <span>Upload Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm text-muted mb-2">
                  <span>Success Rate</span>
                  <span>92%</span>
                </div>
                <Progress 
                  value={92} 
                  className="h-2 [&>div]:bg-green"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="heading-4 text-text">Controls</h4>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => setProgress(Math.max(0, progress - 10))}
                className="bg-purple hover:bg-purple/80 text-white"
              >
                -10%
              </Button>
              <Button 
                size="sm" 
                onClick={() => setProgress(Math.min(100, progress + 10))}
                className="bg-green hover:bg-green/80 text-bg"
              >
                +10%
              </Button>
            </div>
          </div>
        </div>
      )
    },
    {
      name: 'Tabs',
      icon: BarChart3,
      component: (
        <div className="space-y-4">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="bg-line">
              <TabsTrigger value="account" className="data-[state=active]:bg-surface data-[state=active]:text-text">Account</TabsTrigger>
              <TabsTrigger value="password" className="data-[state=active]:bg-surface data-[state=active]:text-text">Password</TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:bg-surface data-[state=active]:text-text">Billing</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="space-y-2">
              <h4 className="heading-4 text-text">Account Settings</h4>
              <p className="body-medium text-muted">
                Manage your account settings and preferences.
              </p>
            </TabsContent>
            <TabsContent value="password" className="space-y-2">
              <h4 className="heading-4 text-text">Password Security</h4>
              <p className="body-medium text-muted">
                Update your password and security settings.
              </p>
            </TabsContent>
            <TabsContent value="billing" className="space-y-2">
              <h4 className="heading-4 text-text">Billing Information</h4>
              <p className="body-medium text-muted">
                Manage your billing and subscription details.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      )
    },
    {
      name: 'Alerts',
      icon: AlertCircle,
      component: (
        <div className="space-y-4">
          <Alert className="border-green bg-green/10">
            <CheckCircle className="h-4 w-4 text-green" />
            <AlertTitle className="text-text">Success</AlertTitle>
            <AlertDescription className="text-muted">
              Your changes have been saved successfully.
            </AlertDescription>
          </Alert>
          
          <Alert className="border-yellow bg-yellow/10">
            <AlertTriangle className="h-4 w-4 text-yellow" />
            <AlertTitle className="text-text">Warning</AlertTitle>
            <AlertDescription className="text-muted">
              Please review your settings before proceeding.
            </AlertDescription>
          </Alert>
          
          <Alert className="border-cyan bg-cyan/10">
            <Info className="h-4 w-4 text-cyan" />
            <AlertTitle className="text-text">Information</AlertTitle>
            <AlertDescription className="text-muted">
              New features are now available in your dashboard.
            </AlertDescription>
          </Alert>
        </div>
      )
    },
    {
      name: 'Table',
      icon: Box,
      component: (
        <div className="space-y-4">
          <Table>
            <TableCaption className="text-muted">Recent transactions</TableCaption>
            <TableHeader>
              <TableRow className="border-line">
                <TableHead className="text-text">Date</TableHead>
                <TableHead className="text-text">Type</TableHead>
                <TableHead className="text-text">Amount</TableHead>
                <TableHead className="text-text text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-line">
                <TableCell className="text-muted">2024-01-15</TableCell>
                <TableCell className="text-text">Clip Reward</TableCell>
                <TableCell className="text-green">+$25.00</TableCell>
                <TableCell className="text-right">
                  <Badge className="bg-green text-bg">Completed</Badge>
                </TableCell>
              </TableRow>
              <TableRow className="border-line">
                <TableCell className="text-muted">2024-01-14</TableCell>
                <TableCell className="text-text">Stream Bonus</TableCell>
                <TableCell className="text-green">+$15.50</TableCell>
                <TableCell className="text-right">
                  <Badge className="bg-green text-bg">Completed</Badge>
                </TableCell>
              </TableRow>
              <TableRow className="border-line">
                <TableCell className="text-muted">2024-01-13</TableCell>
                <TableCell className="text-text">Withdrawal</TableCell>
                <TableCell className="text-yellow">-$100.00</TableCell>
                <TableCell className="text-right">
                  <Badge className="bg-yellow text-bg">Pending</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Box className="h-8 w-8 text-purple" />
          <h1 className="heading-1 bg-gradient-purple-blue bg-clip-text text-transparent">
            UI Kit
          </h1>
        </div>
        <p className="body-large text-muted max-w-2xl mx-auto">
          Complete collection of atomic components with all states and variants. 
          Built with accessibility in mind and consistent design tokens.
        </p>
      </div>

      {/* Components Grid */}
      <div className="grid gap-8">
        {components.map((component) => {
          const Icon = component.icon;
          return (
            <Card key={component.name} className="card-default border-line">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-text">
                  <Icon className="h-5 w-5 text-pink" />
                  <span className="heading-3">{component.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {component.component}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Accessibility Notes */}
      <Card className="card-default border-line">
        <CardHeader>
          <CardTitle className="text-text heading-3">Accessibility Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="heading-4 text-green mb-3">Keyboard Navigation</h4>
              <ul className="space-y-2 body-medium text-muted">
                <li>• Tab through all interactive elements</li>
                <li>• Enter/Space to activate buttons</li>
                <li>• Arrow keys for component navigation</li>
                <li>• Escape to close modals/dropdowns</li>
              </ul>
            </div>
            <div>
              <h4 className="heading-4 text-cyan mb-3">Focus Management</h4>
              <ul className="space-y-2 body-medium text-muted">
                <li>• 2px cyan focus rings</li>
                <li>• Clear focus indicators on all controls</li>
                <li>• Focus trapping in modals</li>
                <li>• Logical focus order</li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="heading-4 text-yellow mb-3">Color & Contrast</h4>
            <p className="body-medium text-muted">
              All color combinations meet WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text). 
              Interactive elements have clear visual states for normal, hover, focus, and disabled conditions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UIKit;