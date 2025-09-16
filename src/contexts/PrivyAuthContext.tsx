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

// Privy configuration - with fallback for demo
const PRIVY_APP_ID = 'YOUR_PRIVY_APP_ID'; // Replace with actual Privy App ID
const USE_PRIVY = PRIVY_APP_ID && PRIVY_APP_ID !== 'YOUR_PRIVY_APP_ID';

const privyConfig = {
  appId: PRIVY_APP_ID,
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

// Main provider component with fallback
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // If no valid Privy App ID, use fallback auth
  if (!USE_PRIVY) {
    return <FallbackAuthProvider>{children}</FallbackAuthProvider>;
  }

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

// Fallback auth provider for when Privy is not configured
const FallbackAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const contextValue: AuthContextType = {
    user: null,
    walletAddress: null,
    isLoading: false,
    loading: false,
    needsOnboarding: false,
    login: () => {
      // Redirect to setup instructions
      alert('Please configure Privy App ID first. Check the console for instructions.');
      console.log(`
🔧 PRIVY SETUP REQUIRED

1. Go to https://privy.io and create an account
2. Create a new app and get your App ID  
3. Replace 'YOUR_PRIVY_APP_ID' in src/contexts/PrivyAuthContext.tsx with your actual App ID
4. The page will automatically reload with Privy authentication enabled

For now, you can use the regular auth at /auth
      `);
    },
    logout: () => {},
    connectWallet: () => {},
    linkGoogleAccount: () => {},
    supabaseSession: null,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};