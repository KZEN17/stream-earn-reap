import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Trash2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RemoveWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: {
    address: string;
    chainType: 'ethereum' | 'solana';
  };
}

export const RemoveWalletModal: React.FC<RemoveWalletModalProps> = ({
  isOpen,
  onClose,
  wallet
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const { toast } = useToast();

  // Mock check if this is the default wallet
  const isDefault = false; // This would come from context in real implementation

  const handleRemove = async () => {
    setIsRemoving(true);
    
    try {
      // Simulate removal delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Wallet Removed",
        description: "The wallet has been disconnected from your account",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Removal Failed",
        description: "Failed to remove wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-800">
            <Trash2 className="w-5 h-5" />
            Remove Wallet
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. The wallet will no longer be used for payouts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Wallet Information */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Chain:</span>
              <Badge variant="outline">{wallet.chainType}</Badge>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Address:</span>
              <code className="block text-xs bg-background p-2 rounded border font-mono break-all">
                {wallet.address}
              </code>
            </div>
            {isDefault && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant="secondary">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Default Wallet
                </Badge>
              </div>
            )}
          </div>

          {/* Warning */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>This will:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Remove the wallet from your account</li>
                  <li>Stop all future payouts to this address</li>
                  {isDefault && <li>Require you to set a new default wallet</li>}
                  <li>Cannot be undone without re-connecting</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {isDefault && (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Important:</strong> This is your default payout wallet. After removal, 
                you'll need to verify and set another wallet as default before you can receive payments.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              {isRemoving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Wallet
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};