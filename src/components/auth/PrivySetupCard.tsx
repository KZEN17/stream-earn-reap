import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Settings, Wallet, Chrome, Mail } from 'lucide-react';

export const PrivySetupCard = () => {
  const openPrivyDocs = () => {
    window.open('https://privy.io', '_blank');
  };

  const openAuthPage = () => {
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            CLIP Rewards
          </h1>
          <p className="text-muted-foreground">
            Earn USDC for your viral clips
          </p>
        </div>

        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Privy Authentication Setup Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertDescription>
                To enable Google login and Solana wallet connections, you need to configure Privy authentication.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Setup Steps:</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <Badge variant="outline" className="mt-0.5">1</Badge>
                  <div>
                    <p className="font-medium">Create Privy Account</p>
                    <p className="text-sm text-muted-foreground">Sign up at privy.io and create a new app</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <Badge variant="outline" className="mt-0.5">2</Badge>
                  <div>
                    <p className="font-medium">Get Your App ID</p>
                    <p className="text-sm text-muted-foreground">Copy your Privy App ID from the dashboard</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                  <Badge variant="outline" className="mt-0.5">3</Badge>
                  <div>
                    <p className="font-medium">Update Configuration</p>
                    <p className="text-sm text-muted-foreground">
                      Replace <code className="bg-muted px-1 rounded">YOUR_PRIVY_APP_ID</code> in{' '}
                      <code className="bg-muted px-1 rounded">src/contexts/PrivyAuthContext.tsx</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={openPrivyDocs} className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                Setup Privy Account
              </Button>
              <Button variant="outline" onClick={openAuthPage} className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Use Basic Auth (Temporary)
              </Button>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">What you'll get with Privy:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Chrome className="w-4 h-4 text-primary" />
                  Google Login
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wallet className="w-4 h-4 text-primary" />
                  Solana Wallets
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="text-xs">USDC</Badge>
                  Direct Payouts
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>Once configured, your app will automatically enable advanced authentication features</p>
        </div>
      </div>
    </div>
  );
};