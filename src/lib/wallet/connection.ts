// P0: Wallet Connection Layer with Chain Validation
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WalletConnection, ChainId } from './types';

interface WalletState {
  connection: WalletConnection | null;
  isConnecting: boolean;
  error: string | null;
  supportedChains: ChainId[];
  
  // Actions
  connect: (provider: string) => Promise<void>;
  disconnect: () => void;
  switchChain: (chainId: ChainId) => Promise<boolean>;
  validateChain: (requiredChain: ChainId) => boolean;
  clearError: () => void;
}

// Chain configuration
const CHAIN_CONFIG: Record<ChainId, {
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: { symbol: string; decimals: number };
}> = {
  'solana-mainnet': {
    name: 'Solana Mainnet',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://explorer.solana.com',
    nativeCurrency: { symbol: 'SOL', decimals: 9 }
  },
  'solana-devnet': {
    name: 'Solana Devnet', 
    rpcUrl: 'https://api.devnet.solana.com',
    explorerUrl: 'https://explorer.solana.com',
    nativeCurrency: { symbol: 'SOL', decimals: 9 }
  },
  'ethereum-mainnet': {
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
    nativeCurrency: { symbol: 'ETH', decimals: 18 }
  },
  'ethereum-sepolia': {
    name: 'Ethereum Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
    explorerUrl: 'https://sepolia.etherscan.io',
    nativeCurrency: { symbol: 'ETH', decimals: 18 }
  },
  'polygon-mainnet': {
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    nativeCurrency: { symbol: 'MATIC', decimals: 18 }
  }
};

export const useWallet = create<WalletState>()(
  persist(
    (set, get) => ({
      connection: null,
      isConnecting: false,
      error: null,
      supportedChains: ['solana-mainnet', 'solana-devnet'],

      connect: async (provider: string) => {
        set({ isConnecting: true, error: null });
        
        try {
          // Simulate wallet connection based on provider
          let mockConnection: WalletConnection;
          
          if (provider === 'phantom') {
            // Check if Phantom is available
            if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
              const phantom = (window as any).solana;
              const response = await phantom.connect();
              mockConnection = {
                address: response.publicKey.toString(),
                chainId: 'solana-mainnet',
                provider: 'phantom',
                isConnected: true
              };
            } else {
              throw new Error('Phantom wallet not found. Please install Phantom extension.');
            }
          } else if (provider === 'metamask') {
            // Check if MetaMask is available
            if (typeof window !== 'undefined' && (window as any).ethereum?.isMetaMask) {
              const ethereum = (window as any).ethereum;
              const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
              const chainId = await ethereum.request({ method: 'eth_chainId' });
              
              mockConnection = {
                address: accounts[0],
                chainId: chainId === '0x1' ? 'ethereum-mainnet' : 'ethereum-sepolia',
                provider: 'metamask',
                isConnected: true
              };
            } else {
              throw new Error('MetaMask not found. Please install MetaMask extension.');
            }
          } else {
            // Fallback mock connection for development
            mockConnection = {
              address: 'MOCK_ADDRESS_' + Math.random().toString(36).substring(7),
              chainId: 'solana-devnet',
              provider: provider,
              isConnected: true
            };
          }

          set({ connection: mockConnection, isConnecting: false });
          
          // Emit connection event for observability
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('wallet_connected', {
              detail: { connection: mockConnection }
            }));
          }
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
          set({ error: errorMessage, isConnecting: false });
          throw error;
        }
      },

      disconnect: () => {
        const { connection } = get();
        if (connection) {
          // Emit disconnection event
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('wallet_disconnected', {
              detail: { address: connection.address }
            }));
          }
        }
        set({ connection: null, error: null });
      },

      switchChain: async (chainId: ChainId) => {
        const { connection } = get();
        if (!connection) {
          throw new Error('No wallet connected');
        }

        try {
          if (connection.provider === 'phantom' && chainId.startsWith('solana')) {
            // Solana chains don't need switching in Phantom
            set({
              connection: { ...connection, chainId }
            });
            return true;
          } else if (connection.provider === 'metamask' && chainId.startsWith('ethereum')) {
            const ethereum = (window as any).ethereum;
            const targetChainId = chainId === 'ethereum-mainnet' ? '0x1' : '0xaa36a7';
            
            try {
              await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: targetChainId }]
              });
              
              set({
                connection: { ...connection, chainId }
              });
              return true;
            } catch (switchError: any) {
              if (switchError.code === 4902) {
                // Chain not added to wallet
                throw new Error(`Please add ${CHAIN_CONFIG[chainId].name} to your wallet`);
              }
              throw switchError;
            }
          }
          
          throw new Error(`Chain switching not supported for ${connection.provider} to ${chainId}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to switch chain';
          set({ error: errorMessage });
          return false;
        }
      },

      validateChain: (requiredChain: ChainId) => {
        const { connection } = get();
        return connection?.chainId === requiredChain;
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'wallet-connection',
      partialize: (state) => ({ connection: state.connection })
    }
  )
);

// Chain utilities
export const getChainConfig = (chainId: ChainId) => CHAIN_CONFIG[chainId];

export const formatChainName = (chainId: ChainId) => CHAIN_CONFIG[chainId].name;

export const getExplorerUrl = (chainId: ChainId, txHash: string) => {
  const config = CHAIN_CONFIG[chainId];
  if (chainId.startsWith('solana')) {
    return `${config.explorerUrl}/tx/${txHash}`;
  } else {
    return `${config.explorerUrl}/tx/${txHash}`;
  }
};

export const isChainSupported = (chainId: string): chainId is ChainId => {
  return Object.keys(CHAIN_CONFIG).includes(chainId);
};