import { useAuth } from '@/contexts/PrivyAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wallet, Mail, Chrome, LogOut, Link, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PrivyLoginButton = () => {
  const { 
    user, 
    walletAddress, 
    isLoading, 
    login, 
    logout, 
    connectWallet, 
    linkGoogleAccount 
  } = useAuth();
  const { toast } = useToast();

  const copyWalletAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to CLIP Rewards
          </CardTitle>
          <p className="text-muted-foreground">
            Connect your accounts to start earning
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={login} 
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            <Mail className="w-5 h-5 mr-2" />
            Sign In / Sign Up
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Connect with email, Google, or your crypto wallet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Account Connected
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{user.email?.address || 'No email'}</span>
            {user.email && (
              <Badge variant="secondary" className="text-xs">Email</Badge>
            )}
          </div>

          {user.google && (
            <div className="flex items-center gap-2">
              <Chrome className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{user.google.name}</span>
              <Badge variant="default" className="text-xs">Google</Badge>
            </div>
          )}
        </div>

        <Separator />

        {/* Wallet Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Wallet</span>
            </div>
            {!walletAddress && (
              <Button variant="outline" size="sm" onClick={connectWallet}>
                <Link className="w-4 h-4 mr-1" />
                Connect
              </Button>
            )}
          </div>

          {walletAddress ? (
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    Connected
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={copyWalletAddress}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-muted/30 p-3 rounded-lg border-2 border-dashed">
              <p className="text-xs text-center text-muted-foreground">
                Connect a wallet to receive USDC payouts
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Additional Actions */}
        <div className="space-y-2">
          {!user.google && (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={linkGoogleAccount}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Link Google Account
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={connectWallet}
          >
            <Wallet className="w-4 h-4 mr-2" />
            {walletAddress ? 'Connect Another Wallet' : 'Connect Wallet'}
          </Button>
        </div>

        <div className="bg-primary/5 p-3 rounded-lg">
          <p className="text-xs text-center text-muted-foreground">
            🎯 Complete setup to start earning from your clips!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};