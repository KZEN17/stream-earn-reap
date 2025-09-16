import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, Clock, Shield, Copy } from 'lucide-react';
import { useSimpleWallet } from '@/contexts/SimpleWalletContext';
import { useToast } from '@/hooks/use-toast';

interface WalletVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: {
    address: string;
    chainType: 'ethereum' | 'solana';
  };
}

export const WalletVerificationModal: React.FC<WalletVerificationModalProps> = ({
  isOpen,
  onClose,
  wallet
}) => {
  const [step, setStep] = useState<'prepare' | 'signing' | 'verifying' | 'complete' | 'error'>('prepare');
  const [errorMessage, setErrorMessage] = useState('');
  const { verifyWallet } = useSimpleWallet();
  const { toast } = useToast();

  const handleVerify = async () => {
    try {
      setStep('signing');
      setErrorMessage('');

      // Call the verification function
      const success = await verifyWallet(wallet);
      
      if (success) {
        setStep('complete');
        setTimeout(() => {
          onClose();
          // Reset step for next time
          setTimeout(() => setStep('prepare'), 500);
        }, 2000);
      } else {
        setStep('error');
        setErrorMessage('Verification failed. Please try again.');
      }
    } catch (error) {
      setStep('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const getStepProgress = () => {
    switch (step) {
      case 'prepare': return 0;
      case 'signing': return 33;
      case 'verifying': return 66;
      case 'complete': return 100;
      case 'error': return 0;
      default: return 0;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Verify Wallet Ownership
          </DialogTitle>
          <DialogDescription>
            Sign a message to prove you own this wallet. No gas fees required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{getStepProgress()}%</span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>

          {/* Wallet Information */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Chain:</span>
              <Badge variant="outline">{wallet.chainType}</Badge>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Address:</span>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-background p-2 rounded border font-mono break-all">
                  {wallet.address}
                </code>
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {step === 'prepare' && (
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p><strong>What happens next:</strong></p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>We'll generate a unique message for you to sign</li>
                      <li>Your wallet will prompt you to sign the message</li>
                      <li>We'll verify the signature matches your wallet</li>
                      <li>Your wallet will be marked as verified</li>
                    </ol>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="bg-green-50 p-3 rounded border border-green-200">
                <div className="flex items-center gap-2 text-green-800 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <strong>No gas fees or blockchain transactions required</strong>
                </div>
              </div>
            </div>
          )}

          {step === 'signing' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
              <div>
                <p className="font-medium">Check your wallet</p>
                <p className="text-sm text-muted-foreground">
                  Please sign the message in your wallet to continue
                </p>
              </div>
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  If you don't see a signature request, check that your wallet is unlocked and connected.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {step === 'verifying' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="animate-pulse rounded-full h-12 w-12 bg-primary/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <p className="font-medium">Verifying signature...</p>
                <p className="text-sm text-muted-foreground">
                  This should only take a few seconds
                </p>
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full h-12 w-12 bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-green-800">Wallet Verified!</p>
                <p className="text-sm text-muted-foreground">
                  You can now receive USDC payouts to this wallet
                </p>
              </div>
            </div>
          )}

          {step === 'error' && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div>
                    <p className="font-medium">Verification Failed</p>
                    <p className="text-sm mt-1">{errorMessage}</p>
                  </div>
                </AlertDescription>
              </Alert>
              
              <div className="bg-muted/50 p-3 rounded text-sm">
                <p className="font-medium mb-2">Common issues:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Message signature was cancelled or rejected</li>
                  <li>Wallet is locked or not connected</li>
                  <li>Network connection issues</li>
                  <li>Wrong wallet selected</li>
                </ul>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            {step === 'prepare' && (
              <>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleVerify}>
                  Start Verification
                </Button>
              </>
            )}

            {(step === 'signing' || step === 'verifying') && (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}

            {step === 'complete' && (
              <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
                Done
              </Button>
            )}

            {step === 'error' && (
              <>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={() => {
                  setStep('prepare');
                  setErrorMessage('');
                }}>
                  Try Again
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};