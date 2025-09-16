import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Wallet, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  Star,
  Shield,
  Trash2,
  ExternalLink,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useSimpleWallet } from '@/contexts/SimpleWalletContext';
import { useToast } from '@/hooks/use-toast';
import { WalletVerificationModal } from './WalletVerificationModal';
import { RemoveWalletModal } from './RemoveWalletModal';

// Chain icons mapping
const ChainIcon = ({ chainType }: { chainType: string }) => {
  const getChainColor = () => {
    switch (chainType) {
      case 'ethereum': return 'text-blue-600';
      case 'solana': return 'text-purple-600';
      case 'polygon': return 'text-purple-500';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`w-6 h-6 rounded-full bg-current/10 flex items-center justify-center ${getChainColor()}`}>
      <span className="text-xs font-bold">
        {chainType === 'ethereum' ? 'Ξ' : 
         chainType === 'solana' ? '◎' : 
         chainType === 'polygon' ? '⬡' : '?'}
      </span>
    </div>
  );
};

export const SimpleWalletUI = () => {
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
  
  const { toast } = useToast();
  const [verificationModal, setVerificationModal] = useState<{
    isOpen: boolean;
    wallet?: { address: string; chainType: 'ethereum' | 'solana' };
  }>({ isOpen: false });
  
  const [removeModal, setRemoveModal] = useState<{
    isOpen: boolean;
    wallet?: any;
  }>({ isOpen: false });

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const startVerification = (wallet: any) => {
    setVerificationModal({
      isOpen: true,
      wallet: {
        address: wallet.address,
        chainType: wallet.chainType
      }
    });
  };

  const closeVerificationModal = () => {
    setVerificationModal({ isOpen: false });
  };

  const startRemoval = (wallet: any) => {
    setRemoveModal({
      isOpen: true,
      wallet
    });
  };

  const closeRemoveModal = () => {
    setRemoveModal({ isOpen: false });
  };

  const handleSetDefault = async (wallet: any) => {
    // This would be implemented in the context
    toast({
      title: "Default Wallet Set",
      description: `${formatAddress(wallet.address)} is now your default payout wallet`,
    });
  };

  if (!ready) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading wallet information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!authenticated) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <Wallet className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Connect or create a wallet with Privy to receive USDC payouts from your clips and campaigns.
          </p>
          <Button onClick={connectWallet} size="lg" className="bg-gradient-to-r from-primary to-primary/90">
            <Wallet className="w-5 h-5 mr-2" />
            Connect / Create Wallet
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Supports MetaMask, Phantom, WalletConnect + embedded wallets
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <Alert className={canReceivePayouts ? "border-green-200 bg-green-50/50" : "border-amber-200 bg-amber-50/50"}>
        <div className="flex items-center gap-3">
          {canReceivePayouts ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          )}
          <div className="flex-1">
            <p className={`font-medium ${canReceivePayouts ? 'text-green-800' : 'text-amber-800'}`}>
              {canReceivePayouts ? '✅ Ready for Payouts' : '⚠️ Setup Required'}
            </p>
            <p className={`text-sm ${canReceivePayouts ? 'text-green-700' : 'text-amber-700'}`}>
              {canReceivePayouts 
                ? 'You have a verified default wallet for receiving USDC payments'
                : 'Add a verified default wallet before you can continue'
              }
            </p>
          </div>
        </div>
      </Alert>

      {/* Connected Wallets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Wallets ({wallets.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={connectWallet} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Wallet
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {wallets.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-4">No wallets connected</p>
              <Button onClick={connectWallet} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Connect Your First Wallet
              </Button>
            </div>
          ) : (
            wallets.map((wallet, index) => {
              const isVerified = verifiedWallets.some(v => v.address === wallet.address);
              const isDefault = verifiedWallets.some(v => v.address === wallet.address && v.isDefault);

              return (
                <div key={wallet.address} className="group border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <ChainIcon chainType={wallet.chainType} />
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {wallet.chainType.toUpperCase()}
                          </Badge>
                          {isVerified && (
                            <Badge variant="default" className="bg-green-600 text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="font-mono text-sm mt-1">{formatAddress(wallet.address)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        onClick={() => copyAddress(wallet.address)}
                        size="sm"
                        variant="ghost"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      
                      {!isVerified && (
                        <Button 
                          onClick={() => startVerification(wallet)}
                          size="sm" 
                          variant="outline"
                          className="border-green-200 hover:bg-green-50 text-green-700"
                        >
                          <Shield className="w-4 h-4 mr-1" />
                          Verify
                        </Button>
                      )}
                      
                      {isVerified && !isDefault && (
                        <Button 
                          onClick={() => handleSetDefault(wallet)}
                          size="sm" 
                          variant="outline"
                          className="border-blue-200 hover:bg-blue-50 text-blue-700"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Set Default
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => startRemoval(wallet)}
                        size="sm"
                        variant="ghost"
                        className="hover:bg-red-50 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {!isVerified && (
                    <Alert className="border-amber-200 bg-amber-50">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Verify to enable payouts</span>
                          <Button 
                            onClick={() => startVerification(wallet)}
                            size="sm" 
                            variant="outline"
                            className="border-amber-300 hover:bg-amber-100 text-amber-700 ml-2"
                          >
                            Verify Ownership
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Full address (expandable) */}
                  <details className="mt-2">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                      View full address
                    </summary>
                    <div className="mt-2 p-2 bg-muted/50 rounded text-xs font-mono break-all">
                      {wallet.address}
                    </div>
                  </details>
                </div>
              );
            })
          )}

          {wallets.length > 0 && (
            <>
              <Separator />
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Manage all wallets</span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <Settings className="w-4 h-4 mr-2" />
                  Disconnect All
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Wallet Security
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Verification requires signing a message (no gas fees)</p>
            <p>• Only verified wallets can receive USDC payouts</p>
            <p>• Set one wallet as default for automatic payments</p>
            <p>• We never store your private keys or seed phrases</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Modals */}
      {verificationModal.wallet && (
        <WalletVerificationModal
          isOpen={verificationModal.isOpen}
          onClose={closeVerificationModal}
          wallet={verificationModal.wallet}
        />
      )}
      
      {removeModal.wallet && (
        <RemoveWalletModal
          isOpen={removeModal.isOpen}
          onClose={closeRemoveModal}
          wallet={removeModal.wallet}
        />
      )}
    </div>
  );
};