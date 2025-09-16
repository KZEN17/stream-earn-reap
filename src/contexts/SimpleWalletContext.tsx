// Simplified Wallet Context for Privy Integration
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth';
import { toast } from '@/hooks/use-toast';

// Types
export interface WalletInfo {
  address: string;
  chainType: 'ethereum' | 'solana';
  isVerified: boolean;
  isDefault: boolean;
  label?: string;
}

interface SimpleWalletContextValue {
  // Privy state
  user: any;
  login: () => void;
  logout: () => void;
  authenticated: boolean;
  ready: boolean;
  
  // Wallet state
  wallets: any[];
  connectWallet: () => void;
  verifiedWallets: WalletInfo[];
  
  // Actions
  verifyWallet: (wallet: any) => Promise<boolean>;
  
  // Computed
  hasWallet: boolean;
  canReceivePayouts: boolean;
}

const SimpleWalletContext = createContext<SimpleWalletContextValue | null>(null);

// Privy Configuration
const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID || 'clnxm4mnv03rj0fmc8gvbchkd';

const PrivyWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#8b5cf6'
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        }
      }}
    >
      <SimpleWalletContextProvider>
        {children}
      </SimpleWalletContextProvider>
    </PrivyProvider>
  );
};

const SimpleWalletContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, login, logout, authenticated, ready } = usePrivy();
  const { wallets } = useWallets();
  
  const [verifiedWallets, setVerifiedWallets] = useState<WalletInfo[]>([]);

  // Mock wallet connection for now
  const handleConnectWallet = () => {
    if (wallets.length === 0) {
      login();
    }
  };

  // Mock wallet verification
  const verifyWallet = async (wallet: any): Promise<boolean> => {
    try {
      // For now, just simulate verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newVerified: WalletInfo = {
        address: wallet.address,
        chainType: wallet.chainType,
        isVerified: true,
        isDefault: verifiedWallets.length === 0, // First wallet becomes default
        label: `${wallet.chainType} wallet`
      };
      
      setVerifiedWallets(prev => [...prev, newVerified]);
      
      toast({
        title: "Wallet Verified",
        description: `${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)} has been verified`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Failed to verify wallet ownership",
        variant: "destructive"
      });
      return false;
    }
  };

  const value: SimpleWalletContextValue = {
    user,
    login,
    logout,
    authenticated,
    ready,
    wallets: wallets || [],
    connectWallet: handleConnectWallet,
    verifiedWallets,
    verifyWallet,
    hasWallet: (wallets?.length || 0) > 0,
    canReceivePayouts: verifiedWallets.some(w => w.isDefault)
  };

  return (
    <SimpleWalletContext.Provider value={value}>
      {children}
    </SimpleWalletContext.Provider>
  );
};

export const useSimpleWallet = () => {
  const context = useContext(SimpleWalletContext);
  if (!context) {
    throw new Error('useSimpleWallet must be used within PrivyWrapper');
  }
  return context;
};

export default PrivyWrapper;