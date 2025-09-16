import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingDown, 
  TrendingUp, 
  Fuel,
  Clock,
  ExternalLink
} from 'lucide-react';
import type { TransactionSimulation, TransactionRequest } from '@/lib/wallet/types';
import { AmountUtils, CHAIN_CONFIGS } from '@/lib/wallet/transaction-simulation';

interface TransactionPreviewProps {
  request: TransactionRequest;
  simulation: TransactionSimulation;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const TransactionPreview: React.FC<TransactionPreviewProps> = ({
  request,
  simulation,
  onConfirm,
  onCancel,
  loading = false
}) => {
  const chainConfig = CHAIN_CONFIGS[request.chainId];
  
  if (!chainConfig) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Unsupported chain: {request.chainId}
        </AlertDescription>
      </Alert>
    );
  }

  // Check if simulation failed
  if (!simulation.success) {
    return (
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            Transaction Simulation Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {simulation.errors.map((error, index) => (
              <Alert key={index} variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Transaction Preview
          </div>
          <Badge variant="outline">
            {chainConfig.nativeSymbol} Chain
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Transaction Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Action:</span>
              <div className="font-medium capitalize">{request.action}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Chain:</span>
              <div className="font-medium">{request.chainId}</div>
            </div>
            <div>
              <span className="text-muted-foreground">From:</span>
              <div className="font-mono text-xs">
                {request.fromAddress.slice(0, 6)}...{request.fromAddress.slice(-4)}
              </div>
            </div>
            {request.toAddress && (
              <div>
                <span className="text-muted-foreground">To:</span>
                <div className="font-mono text-xs">
                  {request.toAddress.slice(0, 6)}...{request.toAddress.slice(-4)}
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Token Changes */}
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
                    {change.symbol === chainConfig.nativeSymbol ? 'Gas Fee' : 'Transfer'}
                  </span>
                </div>
                <div className={`font-mono text-sm ${
                  change.change < 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {change.uiAmount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gas Estimation */}
        {simulation.estimatedGas && simulation.estimatedFee && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Fuel className="w-4 h-4" />
                Gas Estimation
              </h4>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gas Limit:</span>
                  <span className="font-mono">{simulation.estimatedGas.toString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Fee:</span>
                  <span className="font-mono">
                    {AmountUtils.formatDisplay(
                      simulation.estimatedFee, 
                      chainConfig.decimals, 
                      chainConfig.nativeSymbol
                    )}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Warnings */}
        {simulation.warnings.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2 text-amber-700">
                <AlertTriangle className="w-4 h-4" />
                Warnings
              </h4>
              {simulation.warnings.map((warning, index) => (
                <Alert key={index} className="border-amber-200 bg-amber-50">
                  <AlertDescription className="text-amber-800">
                    {warning}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </>
        )}

        {/* Transaction Metadata */}
        <Separator />
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Simulation ID:</span>
            <span className="font-mono">{simulation.simulationId}</span>
          </div>
          <div className="flex justify-between">
            <span>Idempotency Key:</span>
            <span className="font-mono">{request.idempotencyKey.slice(-8)}</span>
          </div>
          <div className="flex justify-between">
            <span>Expires:</span>
            <span>{request.expiresAt.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Confirming...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Sign & Submit
              </>
            )}
          </Button>
        </div>
        
        {/* Explorer Link */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.open(chainConfig.explorerUrl, '_blank')}
            className="text-xs text-muted-foreground"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            View on {request.chainId.includes('solana') ? 'Solscan' : 'Explorer'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};