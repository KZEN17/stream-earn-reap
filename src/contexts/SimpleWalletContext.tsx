// Simplified Wallet Context (Privy removed)
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

// Types
export interface WalletInfo {
  address: string;
  chainType: 'ethereum' | 'solana';
  isVerified: boolean;
  isDefault: boolean;
  label?: string;
}

interface WalletContextType {
  wallets: WalletInfo[];
  connectedWallet: WalletInfo | null;
  isConnecting: boolean;
  connectWallet: (chainType: 'ethereum' | 'solana') => Promise<void>;
  disconnectWallet: () => void;
  addWallet: (wallet: WalletInfo) => void;
  removeWallet: (address: string) => void;
  setDefaultWallet: (address: string) => void;
  verifyWallet: (address: string) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType | null>(null);

const SimpleWalletWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [connectedWallet, setConnectedWallet] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async (chainType: 'ethereum' | 'solana') => {
    setIsConnecting(true);
    try {
      // Simulate wallet connection
      const mockWallet: WalletInfo = {
        address: `mock_${chainType}_address_${Date.now()}`,
        chainType,
        isVerified: false,
        isDefault: true
      };
      
      setConnectedWallet(mockWallet);
      setWallets(prev => [...prev, mockWallet]);
      
      toast({
        title: "Wallet Connected",
        description: `${chainType} wallet connected successfully`
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnectedWallet(null);
    toast({
      title: "Wallet Disconnected",
      description: "Wallet has been disconnected"
    });
  };

  const addWallet = (wallet: WalletInfo) => {
    setWallets(prev => [...prev, wallet]);
  };

  const removeWallet = (address: string) => {
    setWallets(prev => prev.filter(w => w.address !== address));
    if (connectedWallet?.address === address) {
      setConnectedWallet(null);
    }
  };

  const setDefaultWallet = (address: string) => {
    setWallets(prev => prev.map(w => ({
      ...w,
      isDefault: w.address === address
    })));
  };

  const verifyWallet = async (address: string): Promise<boolean> => {
    // Mock verification
    setWallets(prev => prev.map(w => 
      w.address === address ? { ...w, isVerified: true } : w
    ));
    return true;
  };

  const value = {
    wallets,
    connectedWallet,
    isConnecting,
    connectWallet,
    disconnectWallet,
    addWallet,
    removeWallet,
    setDefaultWallet,
    verifyWallet
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useSimpleWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useSimpleWallet must be used within SimpleWalletWrapper');
  }
  return context;
};

export default SimpleWalletWrapper;