import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  Copy,
  Wallet,
  TrendingUp,
  TrendingDown,
  Fuel
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { TransactionRequest, TransactionSimulation } from '@/lib/wallet/types';
import { CHAIN_CONFIGS, AmountUtils } from '@/lib/wallet/transaction-simulation';

interface TransactionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: TransactionRequest;
  simulation: TransactionSimulation;
  onConfirm: () => void;
}

type TransactionStep = 'review' | 'signing' | 'pending' | 'confirmed' | 'failed';

export const TransactionConfirmationModal: React.FC<TransactionConfirmationModalProps> = ({
  isOpen,
  onClose,
  request,
  simulation,
  onConfirm
}) => {
  const [step, setStep] = useState<TransactionStep>('review');
  const [txHash, setTxHash] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const chainConfig = CHAIN_CONFIGS[request.chainId];

  const handleConfirm = async () => {
    try {
      setStep('signing');
      setErrorMessage('');

      // Simulate wallet signing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStep('pending');
      // Simulate transaction pending
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock transaction hash
      const mockTxHash = `0x${Math.random().toString(16).slice(2)}${'0'.repeat(40)}`.slice(0, 66);
      setTxHash(mockTxHash);
      setStep('confirmed');
      
      onConfirm();
      
    } catch (error) {
      setStep('failed');
      setErrorMessage(error instanceof Error ? error.message : 'Transaction failed');
    }
  };

  const copyTxHash = () => {
    navigator.clipboard.writeText(txHash);
    toast({
      title: "Transaction Hash Copied",
      description: "Transaction hash copied to clipboard",
    });
  };

  const openExplorer = () => {
    if (txHash && chainConfig) {
      window.open(`${chainConfig.explorerUrl}${txHash}`, '_blank');
    }
  };

  const getStepProgress = () => {
    switch (step) {
      case 'review': return 0;
      case 'signing': return 25;
      case 'pending': return 50;
      case 'confirmed': return 100;
      case 'failed': return 0;
      default: return 0;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Transaction Confirmation
          </DialogTitle>
          <DialogDescription>
            Review and confirm your {request.action} transaction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          {step !== 'review' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{getStepProgress()}%</span>
              </div>
              <Progress value={getStepProgress()} className="h-2" />
            </div>
          )}

          {/* Transaction Details */}
          {step === 'review' && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <h4 className="font-medium">Transaction Details</h4>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Action:</span>
                    <div className="font-medium capitalize">{request.action}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Chain:</span>
                    <Badge variant="outline">{chainConfig?.nativeSymbol}</Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">From:</span>
                    <code className="text-xs">{request.fromAddress.slice(0, 10)}...{request.fromAddress.slice(-8)}</code>
                  </div>
                  {request.toAddress && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">To:</span>
                      <code className="text-xs">{request.toAddress.slice(0, 10)}...{request.toAddress.slice(-8)}</code>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-mono">
                      {AmountUtils.fromBigInt(request.amount, 6)} USDC
                    </span>
                  </div>
                </div>
              </div>

              {/* Token Changes */}
              {simulation.changes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    Estimated Changes
                  </h4>
                  
                  <div className="space-y-2">
                    {simulation.changes.map((change, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-background/50 rounded border"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{change.symbol}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {change.symbol === chainConfig?.nativeSymbol ? 'Gas Fee' : 'Transfer'}
                          </span>
                        </div>
                        <div className={`font-mono text-sm flex items-center gap-1 ${
                          change.change < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {change.change < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                          {change.uiAmount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gas Estimation */}
              {simulation.estimatedFee && (
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Estimated Fee:</span>
                    </div>
                    <span className="font-mono text-sm text-blue-800">
                      {AmountUtils.formatDisplay(
                        simulation.estimatedFee, 
                        chainConfig?.decimals || 18, 
                        chainConfig?.nativeSymbol || 'ETH'
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Warnings */}
              {simulation.warnings.length > 0 && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription>
                    <div className="space-y-1">
                      {simulation.warnings.map((warning, index) => (
                        <p key={index} className="text-amber-800 text-sm">• {warning}</p>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Signing State */}
          {step === 'signing' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
              <div>
                <p className="font-medium">Waiting for confirmation in wallet</p>
                <p className="text-sm text-muted-foreground">
                  Please check your wallet and confirm the transaction
                </p>
              </div>
            </div>
          )}

          {/* Pending State */}
          {step === 'pending' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="animate-pulse rounded-full h-12 w-12 bg-blue-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="font-medium">Transaction Pending</p>
                <p className="text-sm text-muted-foreground">
                  Your transaction is being processed on the blockchain
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {step === 'confirmed' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full h-12 w-12 bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <p className="font-medium text-green-800">Transaction Confirmed!</p>
                <p className="text-sm text-muted-foreground">
                  Your {request.action} transaction has been successfully processed
                </p>
              </div>
              
              {txHash && (
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-green-800">Transaction Hash:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-white p-2 rounded border font-mono break-all">
                      {txHash}
                    </code>
                    <Button variant="ghost" size="sm" onClick={copyTxHash}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={openExplorer}
                    className="w-full mt-2 border-green-300 hover:bg-green-100"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Explorer
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {step === 'failed' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full h-12 w-12 bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <p className="font-medium text-red-800">Transaction Failed</p>
                <p className="text-sm text-muted-foreground">
                  {errorMessage || 'The transaction could not be completed'}
                </p>
              </div>

              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div>
                    <p className="font-medium">Common causes:</p>
                    <ul className="list-disc list-inside text-sm mt-1">
                      <li>Transaction was rejected in wallet</li>
                      <li>Insufficient balance for gas fees</li>
                      <li>Network congestion or RPC issues</li>
                      <li>Slippage tolerance exceeded</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            {step === 'review' && (
              <>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirm}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sign in Wallet
                </Button>
              </>
            )}

            {(step === 'signing' || step === 'pending') && (
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            )}

            {step === 'confirmed' && (
              <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
                Done
              </Button>
            )}

            {step === 'failed' && (
              <>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={() => setStep('review')}>
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