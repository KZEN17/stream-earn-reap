// P0: Transaction UI with Simulation, Approval/Spend Split & Precision
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTransaction } from '@/lib/wallet/transaction';
import { useWallet } from '@/lib/wallet/connection';
import { useKillSwitch } from '@/lib/killswitch/config';
import { getExplorerUrl } from '@/lib/wallet/connection';
import { 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  Copy, 
  Clock,
  Shield,
  DollarSign,
  Zap,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { TransactionRequest, ChainId } from '@/lib/wallet/types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionRequest: Omit<TransactionRequest, 'id' | 'createdAt' | 'expiresAt' | 'idempotencyKey'> | null;
}

type TransactionStep = 'review' | 'approve' | 'simulate' | 'confirm' | 'sign' | 'success' | 'failed';

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transactionRequest
}) => {
  const { connection } = useWallet();
  const { isActionBlocked } = useKillSwitch();
  const {
    pendingTx,
    simulation,
    result,
    isSimulating,
    isSigning,
    error,
    rateSnapshot,
    createTransaction,
    simulateTransaction,
    signTransaction,
    cancelTransaction,
    captureRateSnapshot,
    validateRateSlippage,
    clearError
  } = useTransaction();

  const [currentStep, setCurrentStep] = useState<TransactionStep>('review');
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);

  // Initialize transaction when modal opens
  useEffect(() => {
    if (isOpen && transactionRequest && !pendingTx) {
      try {
        // Check if action is blocked
        if (isActionBlocked(transactionRequest.action, transactionRequest.chainId)) {
          toast({
            title: "Action Unavailable",
            description: "This action is currently disabled. Please try again later.",
            variant: "destructive"
          });
          return;
        }

        const id = createTransaction(transactionRequest);
        setTxId(id);
        setCurrentStep('review');
        
        // Capture rate snapshot for precision tracking
        if (transactionRequest.tokenMint) {
          captureRateSnapshot(`${transactionRequest.tokenMint}/USD`);
        }
      } catch (err) {
        console.error('Failed to create transaction:', err);
        toast({
          title: "Transaction Error",
          description: err instanceof Error ? err.message : "Failed to create transaction",
          variant: "destructive"
        });
      }
    }
  }, [isOpen, transactionRequest, pendingTx]);

  // Handle modal close
  const handleClose = () => {
    cancelTransaction();
    setCurrentStep('review');
    setUserConfirmed(false);
    setTxId(null);
    clearError();
    onClose();
  };

  // Step 1: Review transaction details
  const handleReview = () => {
    if (!txId) return;
    setCurrentStep('simulate');
    simulateTransaction(txId).then(() => {
      setCurrentStep('approve');
    }).catch(() => {
      setCurrentStep('failed');
    });
  };

  // Step 2: User confirmation
  const handleConfirm = () => {
    if (!userConfirmed) {
      toast({
        title: "Confirmation Required",
        description: "Please review and confirm the transaction details.",
        variant: "destructive"
      });
      return;
    }

    // Check rate slippage before proceeding
    if (!validateRateSlippage(500)) { // 5% max slippage
      toast({
        title: "Rate Changed",
        description: "Exchange rate has changed significantly. Please review again.",
        variant: "destructive"
      });
      // Re-capture rate snapshot
      if (pendingTx?.tokenMint) {
        captureRateSnapshot(`${pendingTx.tokenMint}/USD`);
      }
      return;
    }

    setCurrentStep('sign');
    if (txId) {
      signTransaction(txId, true).then(() => {
        setCurrentStep('success');
      }).catch(() => {
        setCurrentStep('failed');
      });
    }
  };

  // Copy transaction hash
  const copyTxHash = () => {
    if (result?.signature) {
      navigator.clipboard.writeText(result.signature);
      toast({
        title: "Copied!",
        description: "Transaction hash copied to clipboard"
      });
    }
  };

  // Format amount with proper decimals
  const formatAmount = (amount: bigint, decimals: number): string => {
    const divisor = BigInt(10 ** decimals);
    const whole = amount / divisor;
    const fraction = amount % divisor;
    
    if (fraction === BigInt(0)) {
      return whole.toString();
    }
    
    const fractionStr = fraction.toString().padStart(decimals, '0');
    return `${whole}.${fractionStr.replace(/0+$/, '')}`;
  };

  const getTokenSymbol = (chainId: ChainId): string => {
    return chainId.startsWith('solana') ? 'SOL' : 'ETH';
  };

  if (!isOpen || !transactionRequest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {transactionRequest.action.charAt(0).toUpperCase() + transactionRequest.action.slice(1)} Transaction
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-2">
            {['review', 'simulate', 'approve', 'sign', 'success'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  currentStep === step ? 'bg-primary text-primary-foreground' :
                  ['review', 'simulate', 'approve', 'sign', 'success'].indexOf(currentStep) > index ? 'bg-green-500 text-white' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                {index < 4 && <div className="w-8 h-0.5 bg-muted mx-1" />}
              </div>
            ))}
          </div>

          {/* Error display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step content */}
          {currentStep === 'review' && pendingTx && (
            <div className="space-y-4">
              <h3 className="font-medium">Review Transaction</h3>
              
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Action</span>
                  <Badge variant="outline">{pendingTx.action}</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-mono">
                    {formatAmount(pendingTx.amount, pendingTx.decimals)} {getTokenSymbol(pendingTx.chainId)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">From</span>
                  <span className="font-mono text-xs">
                    {pendingTx.fromAddress.slice(0, 8)}...{pendingTx.fromAddress.slice(-8)}
                  </span>
                </div>
                
                {pendingTx.toAddress && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">To</span>
                    <span className="font-mono text-xs">
                      {pendingTx.toAddress.slice(0, 8)}...{pendingTx.toAddress.slice(-8)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Network</span>
                  <Badge className="text-xs">
                    {pendingTx.chainId.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>

              <Button onClick={handleReview} className="w-full" size="lg">
                Continue to Simulation
              </Button>
            </div>
          )}

          {currentStep === 'simulate' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-medium">Simulating Transaction</h3>
                <p className="text-sm text-muted-foreground">
                  Checking balances, fees, and validating transaction...
                </p>
              </div>
            </div>
          )}

          {currentStep === 'approve' && simulation && (
            <div className="space-y-4">
              <h3 className="font-medium">Approve Transaction</h3>
              
              {/* Simulation results */}
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Simulation Successful</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Gas</span>
                    <span className="font-mono">
                      {simulation.estimatedGas ? formatAmount(simulation.estimatedGas, 9) : 'N/A'} SOL
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network Fee</span>
                    <span className="font-mono">
                      {simulation.estimatedFee ? formatAmount(simulation.estimatedFee, 9) : 'N/A'} SOL
                    </span>
                  </div>
                </div>
                
                {/* Token changes */}
                {simulation.changes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Balance Changes:</h4>
                    {simulation.changes.map((change, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{change.symbol}</span>
                        <span className={`font-mono ${change.change < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {change.change < 0 ? '' : '+'}{change.uiAmount}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Rate snapshot info */}
              {rateSnapshot && (
                <Alert>
                  <DollarSign className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Rate locked: {rateSnapshot.tokenPair} = ${rateSnapshot.rate} 
                    (±{(rateSnapshot.slippageBps / 100).toFixed(2)}% slippage)
                  </AlertDescription>
                </Alert>
              )}

              {/* Warnings */}
              {simulation.warnings.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {simulation.warnings.join(', ')}
                  </AlertDescription>
                </Alert>
              )}

              {/* User confirmation */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="confirm"
                  checked={userConfirmed}
                  onChange={(e) => setUserConfirmed(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="confirm" className="text-sm">
                  I understand this transaction will be irreversible once confirmed
                </label>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirm} 
                  disabled={!userConfirmed}
                  className="flex-1"
                  size="lg"
                >
                  Sign Transaction
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'sign' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Shield className="w-8 h-8 animate-pulse text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-medium">Sign in Wallet</h3>
                <p className="text-sm text-muted-foreground">
                  Please approve the transaction in your wallet
                </p>
              </div>
            </div>
          )}

          {currentStep === 'success' && result && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              
              <div className="text-center">
                <h3 className="font-medium text-green-800">Transaction Submitted!</h3>
                <p className="text-sm text-muted-foreground">
                  Your transaction has been submitted to the network
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Transaction Hash</span>
                  <Button size="sm" variant="ghost" onClick={copyTxHash}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="font-mono text-xs break-all bg-background p-2 rounded">
                  {result.signature}
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={result.status === 'confirmed' ? 'default' : 'secondary'}>
                    {result.status}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => window.open(result.explorerUrl, '_blank')}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Explorer
                </Button>
                
                <Button onClick={handleClose} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'failed' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
              
              <div className="text-center">
                <h3 className="font-medium text-red-800">Transaction Failed</h3>
                <p className="text-sm text-red-600">
                  {error || 'An unexpected error occurred'}
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Close
                </Button>
                <Button onClick={() => setCurrentStep('review')} className="flex-1">
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};