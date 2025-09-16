// Simplified Wallet UI Component
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSimpleWallet } from '@/contexts/SimpleWalletContext';
import { 
  Wallet, 
  Shield, 
  Copy, 
  Star,
  AlertTriangle,
  CheckCircle,
  Plus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const SimpleWalletUI: React.FC = () => {
  const {
    user,
    login,
    logout,
    authenticated,
    ready,
    wallets,
    connectWallet,
    verifiedWallets,
    verifyWallet,
    hasWallet,
    canReceivePayouts
  } = useSimpleWallet();

  const [verifyingWallet, setVerifyingWallet] = useState<string | null>(null);

  // Copy wallet address
  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard"
    });
  };

  // Handle wallet verification
  const handleVerifyWallet = async (wallet: any) => {
    setVerifyingWallet(wallet.address);
    await verifyWallet(wallet);
    setVerifyingWallet(null);
  };

  // Get chain display info
  const getChainInfo = (chainType: string) => {
    switch (chainType) {
      case 'ethereum':
        return { name: 'Ethereum', color: 'bg-blue-500' };
      case 'solana':
        return { name: 'Solana', color: 'bg-green-500' };
      default:
        return { name: chainType, color: 'bg-gray-500' };
    }
  };

  if (!ready) {
    return (
      <Card className="w-full">
        <CardContent className="py-8">
          <div className="text-center">Loading wallet connection...</div>
        </CardContent>
      </Card>
    );
  }

  // No user state
  if (!authenticated || !user) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Connect or Create a Wallet</h3>
            <p className="text-muted-foreground mb-4">
              Connect your wallet or create a new one to receive payouts and participate in campaigns.
            </p>
            <Button onClick={login} size="lg">
              Connect / Create Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      {!canReceivePayouts && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Add a verified default wallet to receive payouts.
          </AlertDescription>
        </Alert>
      )}

      {/* Connected Wallets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Connected Wallets ({wallets.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={connectWallet} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Wallet
              </Button>
              <Button onClick={logout} size="sm" variant="ghost">
                Disconnect
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {wallets.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Wallets Connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect a wallet to get started with payouts and transactions.
              </p>
              <Button onClick={connectWallet}>
                <Plus className="w-4 h-4 mr-2" />
                Connect Your First Wallet
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {wallets.map((wallet) => {
                const verified = verifiedWallets.find(v => v.address === wallet.address);
                const isVerifying = verifyingWallet === wallet.address;
                const chainInfo = getChainInfo(wallet.chainType);

                return (
                  <div key={wallet.address} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={chainInfo.color}>
                            {chainInfo.name}
                          </Badge>
                          {verified?.isDefault && (
                            <Badge variant="outline">
                              <Star className="w-3 h-3 mr-1" />
                              Default
                            </Badge>
                          )}
                          {verified?.isVerified && (
                            <Badge variant="secondary">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        
                        <div className="font-mono text-sm">
                          {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
                        </div>
                        
                        {verified?.label && (
                          <div className="text-sm text-muted-foreground">
                            {verified.label}
                          </div>
                        )}
                        
                        <div className="text-xs text-muted-foreground">
                          Type: {wallet.walletClientType || 'Unknown'}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyAddress(wallet.address)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        
                        {!verified?.isVerified && (
                          <Button
                            size="sm"
                            onClick={() => handleVerifyWallet(wallet)}
                            disabled={isVerifying}
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            {isVerifying ? 'Verifying...' : 'Verify'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Default Payout Wallet */}
      {verifiedWallets.filter(w => w.isDefault).map(defaultWallet => (
        <Card key={defaultWallet.address}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Default Payout Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className={getChainInfo(defaultWallet.chainType).color}>
                    {getChainInfo(defaultWallet.chainType).name}
                  </Badge>
                  <span className="text-sm font-medium">Default Payout Destination</span>
                </div>
                <div className="font-mono text-sm">
                  {defaultWallet.address.slice(0, 12)}...{defaultWallet.address.slice(-12)}
                </div>
                {defaultWallet.label && (
                  <div className="text-sm text-muted-foreground">
                    {defaultWallet.label}
                  </div>
                )}
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyAddress(defaultWallet.address)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Security:</strong> Wallet verification requires signing a message to prove ownership. 
          No gas fees are required. Only verified wallets can receive payouts.
        </AlertDescription>
      </Alert>
    </div>
  );
};