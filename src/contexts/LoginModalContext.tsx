import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface LoginModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  requireAuth: (callback?: () => void) => boolean;
}

const LoginModalContext = createContext<LoginModalContextType>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
  requireAuth: () => false,
});

export const useLoginModal = () => {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error('useLoginModal must be used within LoginModalProvider');
  }
  return context;
};

interface LoginModalProviderProps {
  children: ReactNode;
}

export const LoginModalProvider = ({ children }: LoginModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);
  const { user } = useAuth();

  const openModal = () => setIsOpen(true);
  
  const closeModal = () => {
    setIsOpen(false);
    setPendingCallback(null);
  };

  const requireAuth = (callback?: () => void): boolean => {
    // This will be called by components that need auth
    // Returns true if user should proceed, false if modal should open
    if (!user) {
      if (callback) {
        setPendingCallback(() => callback);
      }
      openModal();
      return false;
    }
    
    return true;
  };

  return (
    <LoginModalContext.Provider value={{ 
      isOpen, 
      openModal, 
      closeModal, 
      requireAuth 
    }}>
      {children}
    </LoginModalContext.Provider>
  );
};