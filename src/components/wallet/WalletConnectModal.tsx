// P0: Wallet Connection UI with Chain Validation & Security
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/lib/wallet/connection';
import { useKillSwitch } from '@/lib/killswitch/config';
import { AlertTriangle, Wallet, ExternalLink, Shield, CheckCircle } from 'lucide-react';
import type { ChainId } from '@/lib/wallet/types';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredChain?: ChainId;
  requiredForAction?: string;
}

interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  installed: boolean;
  chains: ChainId[];
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
  requiredChain,
  requiredForAction
}) => {
  const { connection, isConnecting, error, connect, switchChain, clearError } = useWallet();
  const { isActionBlocked } = useKillSwitch();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  // Available wallet providers
  const providers: WalletProvider[] = [
    {
      id: 'phantom',
      name: 'Phantom',
      icon: '👻',
      description: 'Popular Solana wallet',
      installed: typeof window !== 'undefined' && !!(window as any).solana?.isPhantom,
      chains: ['solana-mainnet', 'solana-devnet']
    },
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Ethereum & EVM chains',
      installed: typeof window !== 'undefined' && !!(window as any).ethereum?.isMetaMask,
      chains: ['ethereum-mainnet', 'ethereum-sepolia', 'polygon-mainnet']
    },
    {
      id: 'okx',
      name: 'OKX Wallet',
      icon: '⭕',
      description: 'Multi-chain wallet',
      installed: typeof window !== 'undefined' && !!(window as any).okxwallet,
      chains: ['solana-mainnet', 'ethereum-mainnet', 'polygon-mainnet']
    }
  ];

  const handleConnect = async (providerId: string) => {
    // Check if action is blocked by kill switch
    if (requiredForAction && isActionBlocked(requiredForAction, requiredChain)) {
      alert('This action is currently unavailable. Please try again later.');
      return;
    }

    setSelectedProvider(providerId);
    clearError();

    try {
      await connect(providerId);
      
      // Check if we need to switch chains
      if (requiredChain && connection && connection.chainId !== requiredChain) {
        const switched = await switchChain(requiredChain);
        if (!switched) {
          return; // Error handled by switchChain
        }
      }

      onClose();
    } catch (err) {
      console.error('Connection failed:', err);
    } finally {
      setSelectedProvider(null);
    }
  };

  const handleInstallWallet = (provider: WalletProvider) => {
    const installUrls = {
      phantom: 'https://phantom.app/',
      metamask: 'https://metamask.io/',
      okx: 'https://www.okx.com/web3'
    };

    window.open(installUrls[provider.id as keyof typeof installUrls], '_blank');
  };

  const isProviderCompatible = (provider: WalletProvider) => {
    return !requiredChain || provider.chains.includes(requiredChain);
  };

  const getChainBadgeColor = (chainId: ChainId) => {
    if (chainId.includes('mainnet')) return 'bg-green-500';
    if (chainId.includes('devnet') || chainId.includes('sepolia')) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Required chain info */}
          {requiredChain && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                This action requires connection to{' '}
                <Badge className={getChainBadgeColor(requiredChain)}>
                  {requiredChain.replace('-', ' ').toUpperCase()}
                </Badge>
              </AlertDescription>
            </Alert>
          )}

          {/* Error display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Wallet providers */}
          <div className="space-y-3">
            {providers.map((provider) => {
              const isCompatible = isProviderCompatible(provider);
              const isSelected = selectedProvider === provider.id;
              const isLoading = isConnecting && isSelected;

              return (
                <div
                  key={provider.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    !isCompatible ? 'opacity-50 bg-muted' : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{provider.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{provider.name}</h3>
                          {provider.installed && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {provider.description}
                        </p>
                        {isCompatible && (
                          <div className="flex gap-1 mt-1">
                            {provider.chains.map((chain) => (
                              <Badge
                                key={chain}
                                variant="outline"
                                className="text-xs"
                              >
                                {chain.split('-')[0].toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {provider.installed ? (
                        <Button
                          size="sm"
                          onClick={() => handleConnect(provider.id)}
                          disabled={!isCompatible || isConnecting}
                        >
                          {isLoading ? 'Connecting...' : 'Connect'}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleInstallWallet(provider)}
                          className="flex items-center gap-1"
                        >
                          Install
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                      
                      {!isCompatible && requiredChain && (
                        <Badge variant="destructive" className="text-xs">
                          Incompatible
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Security notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Security Notice:</strong> Only connect wallets you trust. 
              Never share your seed phrase. We'll never ask for your private keys.
            </AlertDescription>
          </Alert>

          {/* Terms acceptance */}
          <div className="text-xs text-muted-foreground text-center">
            By connecting a wallet, you agree to our{' '}
            <button className="underline hover:text-foreground">
              Terms of Service
            </button>{' '}
            and{' '}
            <button className="underline hover:text-foreground">
              Privacy Policy
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};