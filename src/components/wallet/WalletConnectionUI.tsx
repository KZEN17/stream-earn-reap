// Main Wallet Connection UI Component
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useWalletAuth } from '@/contexts/PrivyWalletContext';
import { 
  Wallet, 
  Plus, 
  Shield, 
  Eye, 
  EyeOff, 
  Copy, 
  Trash2, 
  Star,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const WalletConnectionUI: React.FC = () => {
  const {
    user,
    login,
    logout,
    wallets,
    linkWallet,
    verifiedWallets,
    defaultWallet,
    verifyWallet,
    setDefaultWallet,
    removeWallet,
    updateWalletLabel,
    toggleWalletVisibility,
    isLoading,
    hasVerifiedWallet,
    canPerformPayouts
  } = useWalletAuth();

  const [verifyingWallet, setVerifyingWallet] = useState<string | null>(null);
  const [showWalletDialog, setShowWalletDialog] = useState(false);

  // Handle wallet verification
  const handleVerifyWallet = async (wallet: any) => {
    setVerifyingWallet(wallet.address);
    const success = await verifyWallet(wallet);
    setVerifyingWallet(null);
    
    if (success && verifiedWallets.length === 0) {
      // Auto-set as default if it's the first verified wallet
      await setDefaultWallet(wallet.address);
    }
  };

  // Copy wallet address
  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard"
    });
  };

  // Get chain display info
  const getChainInfo = (chainType: string, chainId?: number) => {
    switch (chainType) {
      case 'ethereum':
        if (chainId === 1) return { name: 'Ethereum', color: 'bg-blue-500' };
        if (chainId === 137) return { name: 'Polygon', color: 'bg-purple-500' };
        return { name: 'Ethereum', color: 'bg-blue-500' };
      case 'solana':
        return { name: 'Solana', color: 'bg-green-500' };
      case 'bitcoin':
        return { name: 'Bitcoin', color: 'bg-orange-500' };
      default:
        return { name: chainType, color: 'bg-gray-500' };
    }
  };

  // No user state
  if (!user) {
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
      {!canPerformPayouts && (
        <Alert variant={hasVerifiedWallet ? "default" : "destructive"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {!hasVerifiedWallet 
              ? "Add a verified wallet to receive payouts and participate in campaigns."
              : "Set a default wallet to enable payout functionality."
            }
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
              <Button onClick={linkWallet} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Link Wallet
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
                Link a wallet to get started with payouts and transactions.
              </p>
              <Button onClick={linkWallet}>
                <Plus className="w-4 h-4 mr-2" />
                Link Your First Wallet
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {wallets.map((wallet) => {
                const verified = verifiedWallets.find(v => v.address === wallet.address);
                const isVerifying = verifyingWallet === wallet.address;
                const chainInfo = getChainInfo(wallet.chainType, wallet.chainId);

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
                          {verified?.isPublic && (
                            <Badge variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              Public
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
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyAddress(wallet.address)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        
                        {!verified?.isVerified ? (
                          <Button
                            size="sm"
                            onClick={() => handleVerifyWallet(wallet)}
                            disabled={isVerifying}
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            {isVerifying ? 'Verifying...' : 'Verify'}
                          </Button>
                        ) : (
                          <>
                            {!verified.isDefault && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDefaultWallet(wallet.address)}
                              >
                                <Star className="w-4 h-4 mr-2" />
                                Set Default
                              </Button>
                            )}
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleWalletVisibility(wallet.address)}
                            >
                              {verified.isPublic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeWallet(wallet.address)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
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

      {/* Payout Settings */}
      {defaultWallet && (
        <Card>
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
                  <Badge className={getChainInfo(defaultWallet.chainType, defaultWallet.chainId).color}>
                    {getChainInfo(defaultWallet.chainType, defaultWallet.chainId).name}
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
      )}

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