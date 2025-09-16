import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ChainId } from '@/lib/wallet/types';

interface ChainSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentChain: ChainId;
  requiredChain: ChainId;
  onSwitchComplete: () => void;
}

const CHAIN_DISPLAY = {
  'ethereum-mainnet': { name: 'Ethereum', icon: 'Ξ', color: 'blue' },
  'ethereum-sepolia': { name: 'Ethereum Sepolia', icon: 'Ξ', color: 'blue' },
  'solana-mainnet': { name: 'Solana', icon: '◎', color: 'purple' },
  'solana-devnet': { name: 'Solana Devnet', icon: '◎', color: 'purple' },
  'polygon-mainnet': { name: 'Polygon', icon: '⬡', color: 'purple' }
} as const;

export const ChainSwitchModal: React.FC<ChainSwitchModalProps> = ({
  isOpen,
  onClose,
  currentChain,
  requiredChain,
  onSwitchComplete
}) => {
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchError, setSwitchError] = useState('');
  const { toast } = useToast();

  const currentChainInfo = CHAIN_DISPLAY[currentChain];
  const requiredChainInfo = CHAIN_DISPLAY[requiredChain];

  const handleSwitchNetwork = async () => {
    setIsSwitching(true);
    setSwitchError('');

    try {
      // Simulate network switch delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success/failure (80% success rate)
      if (Math.random() > 0.2) {
        toast({
          title: "Network Switched",
          description: `Successfully switched to ${requiredChainInfo.name}`,
        });
        onSwitchComplete();
        onClose();
      } else {
        throw new Error('User rejected network switch');
      }
    } catch (error) {
      setSwitchError(error instanceof Error ? error.message : 'Failed to switch network');
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-5 h-5" />
            Switch Network Required
          </DialogTitle>
          <DialogDescription>
            You need to switch to {requiredChainInfo.name} to continue with this transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Chain Comparison */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                  {currentChainInfo.icon}
                </div>
                <div>
                  <p className="font-medium text-red-800">Current Network</p>
                  <p className="text-sm text-red-700">{currentChainInfo.name}</p>
                </div>
              </div>
              <Badge variant="destructive">Incompatible</Badge>
            </div>

            <div className="flex justify-center">
              <div className="bg-muted p-2 rounded-full">
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                  {requiredChainInfo.icon}
                </div>
                <div>
                  <p className="font-medium text-green-800">Required Network</p>
                  <p className="text-sm text-green-700">{requiredChainInfo.name}</p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-600">Required</Badge>
            </div>
          </div>

          {/* Instructions */}
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>What happens next:</strong></p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Click "Switch Network" below</li>
                  <li>Your wallet will prompt you to change networks</li>
                  <li>Approve the network switch in your wallet</li>
                  <li>The transaction will continue automatically</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>

          {/* Error Display */}
          {switchError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div>
                  <p className="font-medium">Network Switch Failed</p>
                  <p className="text-sm mt-1">{switchError}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isSwitching}
            >
              Cancel Transaction
            </Button>
            <Button 
              onClick={handleSwitchNetwork}
              disabled={isSwitching}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSwitching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Switching...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Switch Network
                </>
              )}
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-xs text-muted-foreground text-center">
            Having trouble? Make sure your wallet supports {requiredChainInfo.name}.
            <br />
            Some wallets may require manual network addition.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};