import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  needsOnboarding: boolean;
  signOut: () => Promise<void>;
  setNeedsOnboarding: (needs: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  needsOnboarding: false,
  signOut: async () => {},
  setNeedsOnboarding: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session ? 'user logged in' : 'no user');
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false); // Set loading to false immediately
        
        console.log('Auth processing complete, loading set to false');
        
        // Handle profile check separately with setTimeout to avoid blocking
        if (session?.user) {
          setTimeout(() => {
            checkUserProfile(session.user);
          }, 0);
        } else {
          setNeedsOnboarding(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('Initial session check:', session ? 'user logged in' : 'no user');
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false); // Set loading to false immediately
      
      console.log('Initial auth processing complete, loading set to false');
      
      // Handle profile check separately
      if (session?.user) {
        setTimeout(() => {
          checkUserProfile(session.user);
        }, 0);
      } else {
        setNeedsOnboarding(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkUserProfile = async (user: User) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .maybeSingle();
      
      console.log('Profile check result:', profile);
      
      if (!profile || !profile.onboarding_completed) {
        setNeedsOnboarding(true);
        
        // Create profile if it doesn't exist
        if (!profile) {
          createUserProfile(user);
        }
      } else {
        setNeedsOnboarding(false);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setNeedsOnboarding(true); // Default to onboarding if error
    }
  };

  const createUserProfile = async (user: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          username: user.email?.split('@')[0] || '',
          display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        }, {
          onConflict: 'user_id'
        });

      if (error && error.code !== '23505') { // Ignore unique constraint errors
        console.error('Error creating profile:', error);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setNeedsOnboarding(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      needsOnboarding, 
      signOut, 
      setNeedsOnboarding 
    }}>
      {children}
    </AuthContext.Provider>
  );
};