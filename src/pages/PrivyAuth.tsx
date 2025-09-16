import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/PrivyAuthContext';
import { PrivyLoginButton } from '@/components/auth/PrivyLoginButton';
import { PrivySetupCard } from '@/components/auth/PrivySetupCard';

export default function PrivyAuth() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Check if Privy is properly configured
  const privyConfigured = typeof window !== 'undefined' && 
    window.location.href.includes('clym-id=') || // Check if Privy is actually loaded
    localStorage.getItem('privy:token'); // Or has tokens

  useEffect(() => {
    // Redirect authenticated users to home
    if (user && !isLoading) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  // Show setup card if Privy is not configured
  if (!privyConfigured && !user) {
    return <PrivySetupCard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            CLIP Rewards
          </h1>
          <p className="text-muted-foreground">
            Earn USDC for your viral clips
          </p>
        </div>
        
        <PrivyLoginButton />
        
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground mb-4">
            Secure authentication powered by Privy
          </p>
          <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
            <span>✓ Social Login</span>
            <span>✓ Crypto Wallets</span>
            <span>✓ USDC Payouts</span>
          </div>
        </div>
      </div>
    </div>
  );
}