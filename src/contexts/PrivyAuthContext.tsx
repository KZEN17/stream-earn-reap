import React, { createContext, useContext, useEffect, useState } from 'react';
import { PrivyProvider, usePrivy, User as PrivyUser } from '@privy-io/react-auth';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: PrivyUser | null;
  walletAddress: string | null;
  isLoading: boolean;
  loading: boolean; // Add for backward compatibility
  needsOnboarding: boolean;
  login: () => void;
  logout: () => void;
  connectWallet: () => void;
  linkGoogleAccount: () => void;
  supabaseSession: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Privy configuration
const privyConfig = {
  appId: 'YOUR_PRIVY_APP_ID', // User will need to replace this
  config: {
    loginMethods: ['email', 'google', 'wallet'],
    appearance: {
      theme: 'light',
      accentColor: '#676FFF',
      logo: 'https://your-logo-url.com/logo.png',
    },
    walletConnectCloudProjectId: 'YOUR_WC_PROJECT_ID', // Optional for WalletConnect
    supportedChains: [
      // Ethereum mainnet for USDC
      {
        id: 1,
        name: 'Ethereum',
        network: 'homestead',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: { default: { http: ['https://rpc.ankr.com/eth'] } },
      },
      // Solana mainnet
      {
        id: 101, // Solana mainnet cluster
        name: 'Solana',
        network: 'mainnet-beta',
        nativeCurrency: { name: 'SOL', symbol: 'SOL', decimals: 9 },
        rpcUrls: { default: { http: ['https://api.mainnet-beta.solana.com'] } },
      }
    ],
    embeddedWallets: {
      createOnLogin: 'users-without-wallets',
      noPromptOnSignature: false,
    },
    externalWallets: {
      coinbaseWallet: { connectionOptions: 'smartWalletOnly' },
      metamask: true,
      rainbow: true,
      walletConnect: true,
      // Solana wallets
      phantom: true,
      solflare: true,
      backpack: true,
    },
  }
};

// Inner component that uses Privy hooks
const AuthProviderInner = ({ children }: { children: React.ReactNode }) => {
  const { 
    user, 
    ready, 
    authenticated, 
    login, 
    logout: privyLogout,
    connectWallet,
    linkGoogle,
    getAccessToken,
  } = usePrivy();
  
  const [supabaseSession, setSupabaseSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // Get wallet address from connected wallets
  const walletAddress = user?.wallet?.address || 
    user?.linkedAccounts?.find(account => account.type === 'wallet')?.address || 
    null;

  // Sync Privy user with Supabase
  useEffect(() => {
    const syncWithSupabase = async () => {
      if (!user || !authenticated) {
        // Clear Supabase session if no Privy user
        await supabase.auth.signOut();
        setSupabaseSession(null);
        return;
      }

      try {
        // Get Privy access token
        const accessToken = await getAccessToken();
        
        // Create or get Supabase user using Privy user data
        const supabaseUser = {
          id: user.id,
          email: user.email?.address || `${user.id}@privy.io`,
          user_metadata: {
            privy_user_id: user.id,
            wallet_address: walletAddress,
            google_email: user.google?.email,
            display_name: user.google?.name || user.email?.address?.split('@')[0],
          }
        };

        // Sign in to Supabase with custom provider (we'll create this)
        const { data, error } = await supabase.auth.signInWithPassword({
          email: supabaseUser.email,
          password: user.id // Use Privy ID as password
        });

        if (error && error.message.includes('Invalid login credentials')) {
          // User doesn't exist, create them
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: supabaseUser.email,
            password: user.id,
            options: {
              data: supabaseUser.user_metadata
            }
          });

          if (signUpError) throw signUpError;
          setSupabaseSession(signUpData.session);
        } else if (error) {
          throw error;
        } else {
          setSupabaseSession(data.session);
        }

        // Update profile with latest data
        if (supabaseSession || data?.session) {
          const { data: profileData } = await supabase
            .from('profiles')
            .upsert({
              user_id: user.id,
              display_name: user.google?.name || user.email?.address?.split('@')[0],
              avatar_url: (user.google as any)?.picture || (user.google as any)?.profilePictureUrl,
              wallet_address: walletAddress,
              username: user.email?.address?.split('@')[0] || `user_${user.id.slice(0, 8)}`,
            })
            .select()
            .single();

          // Check if user needs onboarding
          if (profileData && !profileData.onboarding_completed) {
            setNeedsOnboarding(true);
          } else {
            setNeedsOnboarding(false);
          }
        }

      } catch (error) {
        console.error('Error syncing with Supabase:', error);
      }
    };

    syncWithSupabase();
  }, [user, authenticated, walletAddress, getAccessToken]);

  useEffect(() => {
    if (ready) {
      setIsLoading(false);
    }
  }, [ready]);

  const logout = async () => {
    await privyLogout();
    await supabase.auth.signOut();
    setSupabaseSession(null);
  };

  const contextValue: AuthContextType = {
    user,
    walletAddress,
    isLoading: !ready || isLoading,
    loading: !ready || isLoading, // Add for backward compatibility
    needsOnboarding,
    login,
    logout,
    connectWallet,
    linkGoogleAccount: linkGoogle,
    supabaseSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Main provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider
      appId={privyConfig.appId}
      config={privyConfig.config as any}
    >
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </PrivyProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};