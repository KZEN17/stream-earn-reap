// Privy Wallet Authentication Context
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Types
export interface VerifiedWallet {
  address: string;
  chainType: 'ethereum' | 'solana' | 'bitcoin';
  chainId?: number;
  isDefault: boolean;
  isVerified: boolean;
  verifiedAt?: Date;
  label?: string;
  isPublic: boolean;
}

export interface WalletContextValue {
  // Privy auth state
  user: any;
  login: () => void;
  logout: () => void;
  
  // Wallet management
  wallets: any[];
  linkWallet: () => void;
  verifiedWallets: VerifiedWallet[];
  defaultWallet: VerifiedWallet | null;
  
  // Actions
  verifyWallet: (wallet: any) => Promise<boolean>;
  setDefaultWallet: (address: string) => Promise<boolean>;
  removeWallet: (address: string) => Promise<boolean>;
  updateWalletLabel: (address: string, label: string) => Promise<boolean>;
  toggleWalletVisibility: (address: string) => Promise<boolean>;
  
  // State
  isLoading: boolean;
  hasVerifiedWallet: boolean;
  canPerformPayouts: boolean;
}

const WalletContext = createContext<WalletContextValue | null>(null);

// Privy Configuration
const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID || 'cly6g6l0b0000c8uh8kd7l9hd'; // fallback ID

const PrivyWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['email', 'wallet', 'google'],
        appearance: {
          theme: 'dark',
          accentColor: '#8b5cf6',
          logo: '/icon-192x192.png'
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        },
        externalWallets: {
          metamask: true,
          phantom: true,
          coinbaseWallet: true,
          walletConnect: true
        }
      }}
    >
      <WalletContextProvider>
        {children}
      </WalletContextProvider>
    </PrivyProvider>
  );
};

// Context Provider Implementation
const WalletContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, login, logout, authenticated, ready } = usePrivy();
  const { wallets, linkWallet } = useWallets();
  
  const [verifiedWallets, setVerifiedWallets] = useState<VerifiedWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load verified wallets from database
  const loadVerifiedWallets = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      const wallets: VerifiedWallet[] = (data || []).map(wallet => ({
        address: wallet.address,
        chainType: wallet.chain_type,
        chainId: wallet.chain_id,
        isDefault: wallet.is_default,
        isVerified: wallet.is_verified,
        verifiedAt: wallet.verified_at ? new Date(wallet.verified_at) : undefined,
        label: wallet.label,
        isPublic: wallet.is_public
      }));
      
      setVerifiedWallets(wallets);
    } catch (error) {
      console.error('Failed to load verified wallets:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load wallets when user changes
  useEffect(() => {
    if (ready && authenticated && user) {
      loadVerifiedWallets();
    } else if (ready && !authenticated) {
      setVerifiedWallets([]);
      setIsLoading(false);
    }
  }, [user, authenticated, ready]);

  // Verify wallet ownership
  const verifyWallet = async (wallet: any): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      setIsLoading(true);
      
      // Get nonce from server
      const nonceResponse = await fetch('/api/wallet/nonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      
      if (!nonceResponse.ok) {
        throw new Error('Failed to get verification nonce');
      }
      
      const { nonce } = await nonceResponse.json();
      
      // Sign message with wallet
      const message = `Verify wallet ownership for CLIP\nNonce: ${nonce}`;
      const signature = await wallet.signMessage(message);
      
      // Verify signature on server
      const verifyResponse = await fetch('/api/wallet/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          address: wallet.address,
          chainType: wallet.chainType,
          chainId: wallet.chainId,
          signature,
          nonce,
          message
        })
      });
      
      if (!verifyResponse.ok) {
        throw new Error('Wallet verification failed');
      }
      
      // Refresh verified wallets
      await loadVerifiedWallets();
      
      toast({
        title: "Wallet Verified",
        description: `${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)} has been verified`,
      });
      
      return true;
    } catch (error) {
      console.error('Wallet verification failed:', error);
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Failed to verify wallet",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Set default wallet
  const setDefaultWallet = async (address: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const response = await fetch('/api/wallet/set-default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          address
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to set default wallet');
      }
      
      await loadVerifiedWallets();
      
      toast({
        title: "Default Wallet Set",
        description: `${address.slice(0, 8)}...${address.slice(-6)} is now your default payout wallet`,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to set default wallet:', error);
      toast({
        title: "Error",
        description: "Failed to set default wallet",
        variant: "destructive"
      });
      return false;
    }
  };

  // Remove wallet
  const removeWallet = async (address: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('user_wallets')
        .delete()
        .eq('user_id', user.id)
        .eq('address', address);
        
      if (error) throw error;
      
      await loadVerifiedWallets();
      
      toast({
        title: "Wallet Removed",
        description: `${address.slice(0, 8)}...${address.slice(-6)} has been removed`,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to remove wallet:', error);
      toast({
        title: "Error", 
        description: "Failed to remove wallet",
        variant: "destructive"
      });
      return false;
    }
  };

  // Update wallet label
  const updateWalletLabel = async (address: string, label: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('user_wallets')
        .update({ label })
        .eq('user_id', user.id)
        .eq('address', address);
        
      if (error) throw error;
      
      await loadVerifiedWallets();
      return true;
    } catch (error) {
      console.error('Failed to update wallet label:', error);
      return false;
    }
  };

  // Toggle wallet visibility
  const toggleWalletVisibility = async (address: string): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const wallet = verifiedWallets.find(w => w.address === address);
      if (!wallet) return false;
      
      const { error } = await supabase
        .from('user_wallets')
        .update({ is_public: !wallet.isPublic })
        .eq('user_id', user.id)
        .eq('address', address);
        
      if (error) throw error;
      
      await loadVerifiedWallets();
      return true;
    } catch (error) {
      console.error('Failed to toggle wallet visibility:', error);
      return false;
    }
  };

  // Computed values
  const defaultWallet = verifiedWallets.find(w => w.isDefault) || null;
  const hasVerifiedWallet = verifiedWallets.some(w => w.isVerified);
  const canPerformPayouts = hasVerifiedWallet && defaultWallet !== null;

  const value: WalletContextValue = {
    // Privy auth state
    user,
    login,
    logout,
    
    // Wallet management
    wallets: wallets || [],
    linkWallet,
    verifiedWallets,
    defaultWallet,
    
    // Actions
    verifyWallet,
    setDefaultWallet,
    removeWallet,
    updateWalletLabel,
    toggleWalletVisibility,
    
    // State
    isLoading,
    hasVerifiedWallet,
    canPerformPayouts
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Hook to use wallet context
export const useWalletAuth = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletAuth must be used within a PrivyWrapper');
  }
  return context;
};

export default PrivyWrapper;