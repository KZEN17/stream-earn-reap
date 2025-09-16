import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, AlertTriangle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { useSimpleWallet } from '@/contexts/SimpleWalletContext';
import { useKillSwitch } from '@/lib/killswitch/config';
import { useTransactionObservability } from '@/hooks/useTransactionObservability';
import type { ChainId } from '@/lib/wallet/types';

interface WalletGateProps {
  action: 'donate' | 'payout' | 'approve' | 'tip' | 'claim' | 'refund' | 'sponsor' | 'free_order';
  requiredChain?: ChainId;
  amount?: bigint;
  tokenSymbol?: string;
  onProceed?: () => void;
  children: React.ReactNode;
}

export const WalletGate: React.FC<WalletGateProps> = ({
  action,
  requiredChain,
  amount,
  tokenSymbol = 'USDC',
  onProceed,
  children
}) => {
  const { 
    authenticated, 
    ready, 
    wallets, 
    verifiedWallets, 
    canReceivePayouts,
    connectWallet 
  } = useSimpleWallet();
  
  const { isActionBlocked } = useKillSwitch();

  // Check if ready
  if (!ready) {
    return (
      <Card className="border-muted">
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading wallet status...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if action is blocked by kill switch
  if (isActionBlocked(action, requiredChain)) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {action.charAt(0).toUpperCase() + action.slice(1)} operations are temporarily disabled for maintenance. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // Not authenticated
  if (!authenticated) {
    return (
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Wallet className="w-5 h-5" />
            Authentication Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-orange-700">
            Please sign in to continue with {action} operations.
          </p>
          <Button 
            onClick={connectWallet}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            Sign In / Sign Up
          </Button>
        </CardContent>
      </Card>
    );
  }

  // No wallets connected
  if (wallets.length === 0) {
    return (
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Wallet className="w-5 h-5" />
            Wallet Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-700">
            Connect a wallet to enable {action} operations and receive {tokenSymbol} payouts.
          </p>
          <Button 
            onClick={connectWallet}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  // No verified wallets (for payout/refund/sponsor/free_order)
  const payoutActions = ['payout', 'refund', 'sponsor', 'free_order'];
  if (payoutActions.includes(action) && !canReceivePayouts) {
    return (
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-5 h-5" />
            Wallet Verification Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-amber-700">
            You need a verified default wallet to receive {tokenSymbol} payouts from {action} operations.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-medium text-amber-800">Connected Wallets:</h4>
            {wallets.map((wallet, index) => (
              <div key={wallet.address} className="flex items-center justify-between p-2 bg-white/50 rounded border">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{wallet.chainType}</Badge>
                  <code className="text-xs">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</code>
                </div>
                <Badge variant="secondary">Not Verified</Badge>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={() => window.location.href = '/profile?tab=wallets'}
            className="w-full bg-amber-600 hover:bg-amber-700"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Verify Wallets in Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Wrong chain warning
  if (requiredChain && verifiedWallets.length > 0) {
    const defaultWallet = verifiedWallets.find(w => w.isDefault);
    const hasCorrectChain = verifiedWallets.some(w => 
      (requiredChain.includes('ethereum') && w.chainType === 'ethereum') ||
      (requiredChain.includes('solana') && w.chainType === 'solana')
    );

    if (!hasCorrectChain) {
      return (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              Incompatible Chain
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-700">
              This {action} operation requires a {requiredChain} wallet, but your verified wallets are on different chains.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium text-red-800">Required:</h4>
              <Badge variant="outline">{requiredChain}</Badge>
              
              <h4 className="font-medium text-red-800 mt-3">Your Verified Wallets:</h4>
              {verifiedWallets.map((wallet, index) => (
                <div key={wallet.address} className="flex items-center justify-between p-2 bg-white/50 rounded border">
                  <div className="flex items-center gap-2">
                    <Badge variant={wallet.isDefault ? "default" : "secondary"}>
                      {wallet.chainType}
                    </Badge>
                    <code className="text-xs">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</code>
                    {wallet.isDefault && <Badge variant="outline">Default</Badge>}
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={() => window.location.href = '/profile?tab=wallets'}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Add {requiredChain.charAt(0).toUpperCase() + requiredChain.slice(1)} Wallet
            </Button>
          </CardContent>
        </Card>
      );
    }
  }

  // All checks passed - show success state with action button
  return (
    <div className="space-y-4">
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="flex items-center justify-between">
            <div>
              Wallet verified and ready for {action} operations
              {amount && (
                <span className="ml-2 font-mono">
                  ({(Number(amount) / 1e6).toFixed(2)} {tokenSymbol})
                </span>
              )}
            </div>
            {verifiedWallets.length > 0 && (
              <Badge variant="outline" className="text-green-700 border-green-300">
                {verifiedWallets.find(w => w.isDefault)?.chainType || 'Multi-chain'}
              </Badge>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {/* Show the protected content */}
      {children}
      
      {onProceed && (
        <Button 
          onClick={onProceed}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Proceed with {action.charAt(0).toUpperCase() + action.slice(1)}
        </Button>
      )}
    </div>
  );
};