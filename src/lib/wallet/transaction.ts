// P0: Transaction Layer with Simulation, Idempotency & Precision
import { create } from 'zustand';
import type { 
  TransactionRequest, 
  TransactionSimulation, 
  TransactionResult, 
  ActionCaps, 
  RateSnapshot,
  ChainId
} from './types';
import { useWallet } from './connection';

interface TransactionState {
  pendingTx: TransactionRequest | null;
  simulation: TransactionSimulation | null;
  result: TransactionResult | null;
  isSimulating: boolean;
  isSigning: boolean;
  error: string | null;
  
  // Rate tracking for precision
  rateSnapshot: RateSnapshot | null;
  
  // Actions
  createTransaction: (params: Omit<TransactionRequest, 'id' | 'createdAt' | 'expiresAt' | 'idempotencyKey'>) => string;
  simulateTransaction: (txId: string) => Promise<TransactionSimulation>;
  signTransaction: (txId: string, userConfirmed: boolean) => Promise<TransactionResult>;
  cancelTransaction: () => void;
  clearError: () => void;
  
  // Rate management
  captureRateSnapshot: (tokenPair: string) => Promise<void>;
  validateRateSlippage: (maxSlippageBps: number) => boolean;
}

// Action caps configuration per environment
const ACTION_CAPS: Record<string, ActionCaps> = {
  donate: {
    perTx: BigInt('1000000000'), // 1 SOL in lamports
    perDay: BigInt('10000000000'), // 10 SOL
    perWallet: BigInt('100000000000'), // 100 SOL
  },
  tip: {
    perTx: BigInt('100000000'), // 0.1 SOL
    perDay: BigInt('1000000000'), // 1 SOL
    perWallet: BigInt('10000000000'), // 10 SOL
  },
  payout: {
    perTx: BigInt('10000000000'), // 10 SOL
    perDay: BigInt('100000000000'), // 100 SOL
    perWallet: BigInt('1000000000000'), // 1000 SOL
    perCampaign: BigInt('10000000000000'), // 10000 SOL
  }
};

// Idempotency tracking
const idempotencyCache = new Map<string, { timestamp: number; result: any }>();
const IDEMPOTENCY_WINDOW_MS = 90 * 1000; // 90 seconds

export const useTransaction = create<TransactionState>((set, get) => ({
  pendingTx: null,
  simulation: null,
  result: null,
  isSimulating: false,
  isSigning: false,
  error: null,
  rateSnapshot: null,

  createTransaction: (params) => {
    const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const idempotencyKey = `${params.action}_${params.fromAddress}_${params.amount}_${Date.now()}`;
    
    // Check for duplicate within idempotency window
    const cached = idempotencyCache.get(idempotencyKey);
    if (cached && Date.now() - cached.timestamp < IDEMPOTENCY_WINDOW_MS) {
      throw new Error('Duplicate transaction detected. Please wait before trying again.');
    }
    
    const transaction: TransactionRequest = {
      ...params,
      id: txId,
      idempotencyKey,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minute expiry
    };
    
    // Validate action caps
    const caps = ACTION_CAPS[params.action];
    if (caps && params.amount > caps.perTx) {
      throw new Error(`Amount exceeds per-transaction limit of ${formatAmount(caps.perTx, params.decimals)}`);
    }
    
    set({ pendingTx: transaction, error: null });
    
    // Cache for idempotency
    idempotencyCache.set(idempotencyKey, { timestamp: Date.now(), result: txId });
    
    // Emit transaction created event
    emitTransactionEvent('tx_created', transaction);
    
    return txId;
  },

  simulateTransaction: async (txId: string) => {
    const { pendingTx } = get();
    if (!pendingTx || pendingTx.id !== txId) {
      throw new Error('Transaction not found');
    }
    
    set({ isSimulating: true, error: null });
    
    try {
      const simulation = await performSimulation(pendingTx);
      
      if (!simulation.success) {
        throw new Error(`Simulation failed: ${simulation.errors.join(', ')}`);
      }
      
      set({ simulation, isSimulating: false });
      
      // Emit simulation event
      emitTransactionEvent('tx_sim', pendingTx, { 
        success: simulation.success,
        estimatedGas: simulation.estimatedGas?.toString(),
        warnings: simulation.warnings
      });
      
      return simulation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Simulation failed';
      set({ error: errorMessage, isSimulating: false });
      
      emitTransactionEvent('tx_fail', pendingTx, { 
        error: errorMessage,
        stage: 'simulation'
      });
      
      throw error;
    }
  },

  signTransaction: async (txId: string, userConfirmed: boolean) => {
    const { pendingTx, simulation } = get();
    if (!pendingTx || pendingTx.id !== txId) {
      throw new Error('Transaction not found');
    }
    
    if (!simulation || !simulation.success) {
      throw new Error('Transaction must be simulated successfully first');
    }
    
    if (!userConfirmed) {
      throw new Error('User confirmation required');
    }
    
    // Check if rate has changed significantly
    const { rateSnapshot } = get();
    if (rateSnapshot && !get().validateRateSlippage(500)) { // 5% max slippage
      throw new Error('Exchange rate has changed significantly. Please review and confirm again.');
    }
    
    set({ isSigning: true, error: null });
    
    try {
      const result = await performSigning(pendingTx, simulation);
      
      set({ result, isSigning: false });
      
      // Emit signing events
      emitTransactionEvent('tx_submit', pendingTx, { signature: result.signature });
      
      // Start confirmation polling
      pollForConfirmation(result.signature, pendingTx);
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
      set({ error: errorMessage, isSigning: false });
      
      emitTransactionEvent('tx_fail', pendingTx, { 
        error: errorMessage,
        stage: 'signing'
      });
      
      throw error;
    }
  },

  cancelTransaction: () => {
    const { pendingTx } = get();
    if (pendingTx) {
      emitTransactionEvent('tx_cancel', pendingTx);
    }
    set({ 
      pendingTx: null, 
      simulation: null, 
      result: null, 
      error: null,
      rateSnapshot: null
    });
  },

  captureRateSnapshot: async (tokenPair: string) => {
    try {
      // Simulate rate fetching - in production this would call actual price APIs
      const mockRate = (1.2345 + Math.random() * 0.1).toFixed(6);
      const snapshot: RateSnapshot = {
        tokenPair,
        rate: mockRate,
        slippageBps: 50, // 0.5% typical slippage
        timestamp: new Date(),
        source: 'jupiter' // or other DEX aggregator
      };
      
      set({ rateSnapshot: snapshot });
    } catch (error) {
      console.warn('Failed to capture rate snapshot:', error);
    }
  },

  validateRateSlippage: (maxSlippageBps: number) => {
    const { rateSnapshot } = get();
    if (!rateSnapshot) return true; // No snapshot to compare
    
    // Simulate current rate check
    const currentRate = parseFloat(rateSnapshot.rate) * (1 + (Math.random() - 0.5) * 0.02);
    const priceDiff = Math.abs(currentRate - parseFloat(rateSnapshot.rate)) / parseFloat(rateSnapshot.rate);
    const slippageBps = priceDiff * 10000;
    
    return slippageBps <= maxSlippageBps;
  },

  clearError: () => set({ error: null })
}));

// Simulation logic
async function performSimulation(tx: TransactionRequest): Promise<TransactionSimulation> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  const simulationId = `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  // Check wallet connection and chain
  const wallet = useWallet.getState();
  if (!wallet.connection) {
    return {
      success: false,
      errors: ['Wallet not connected'],
      warnings: [],
      changes: [],
      simulationId
    };
  }
  
  if (!wallet.validateChain(tx.chainId)) {
    return {
      success: false,
      errors: [`Wrong network. Expected ${tx.chainId}, got ${wallet.connection.chainId}`],
      warnings: [],
      changes: [],
      simulationId
    };
  }
  
  // Simulate balance check
  const mockBalance = BigInt(Math.floor(Math.random() * 10000000000)); // Random balance
  if (tx.source === 'user_wallet' && tx.amount > mockBalance) {
    return {
      success: false,
      errors: ['Insufficient balance'],
      warnings: [], 
      changes: [],
      simulationId
    };
  }
  
  // Successful simulation
  const changes = [{
    mint: tx.tokenMint,
    symbol: tx.chainId.startsWith('solana') ? 'SOL' : 'ETH',
    decimals: tx.decimals,
    change: -tx.amount,
    uiAmount: formatAmount(tx.amount, tx.decimals)
  }];
  
  const estimatedGas = tx.chainId.startsWith('solana') 
    ? BigInt(5000) // 5000 lamports
    : BigInt(21000); // 21000 gas units
    
  const estimatedFee = estimatedGas * BigInt(1000); // Simplified fee calc
  
  return {
    success: true,
    estimatedGas,
    estimatedFee,
    changes,
    warnings: [],
    errors: [],
    simulationId
  };
}

// Signing logic
async function performSigning(tx: TransactionRequest, simulation: TransactionSimulation): Promise<TransactionResult> {
  // Simulate signing delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
  
  // Generate mock transaction result
  const signature = `sig_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  return {
    txId,
    signature,
    status: 'pending',
    actualFee: simulation.estimatedFee,
    explorerUrl: getExplorerUrl(tx.chainId, signature),
    confirmationTime: new Date()
  };
}

// Confirmation polling
async function pollForConfirmation(signature: string, tx: TransactionRequest) {
  let attempts = 0;
  const maxAttempts = 30; // 30 attempts = ~2.5 minutes
  
  const poll = async () => {
    attempts++;
    
    // Simulate confirmation check
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const isConfirmed = Math.random() > (0.1 + attempts * 0.02); // Increasing confirmation probability
    
    if (isConfirmed) {
      const { result } = useTransaction.getState();
      if (result && result.signature === signature) {
        useTransaction.setState({
          result: {
            ...result,
            status: 'confirmed',
            blockNumber: Math.floor(Math.random() * 1000000),
            confirmationTime: new Date()
          }
        });
        
        emitTransactionEvent('tx_confirm', tx, { signature, attempts });
      }
    } else if (attempts < maxAttempts) {
      setTimeout(poll, 5000);
    } else {
      // Timeout
      const { result } = useTransaction.getState(); 
      if (result && result.signature === signature) {
        useTransaction.setState({
          result: { ...result, status: 'failed', error: 'Confirmation timeout' }
        });
        
        emitTransactionEvent('tx_fail', tx, { 
          error: 'Confirmation timeout',
          signature,
          attempts
        });
      }
    }
  };
  
  setTimeout(poll, 5000);
}

// Event emission for observability
function emitTransactionEvent(eventType: string, tx: TransactionRequest, metadata: Record<string, any> = {}) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('transaction_event', {
      detail: {
        eventType,
        idempotencyKey: tx.idempotencyKey,
        source: tx.source,
        amountAtomic: tx.amount.toString(),
        chain: tx.chainId,
        ctaId: tx.metadata.ctaId || 'unknown',
        sessionId: sessionStorage.getItem('sessionId') || 'unknown',
        timestamp: new Date(),
        metadata: { ...tx.metadata, ...metadata }
      }
    }));
  }
}

// Utility functions
function formatAmount(amount: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;
  
  if (fraction === BigInt(0)) {
    return whole.toString();
  }
  
  const fractionStr = fraction.toString().padStart(decimals, '0');
  return `${whole}.${fractionStr.replace(/0+$/, '')}`;
}

function getExplorerUrl(chainId: ChainId, signature: string): string {
  const baseUrls = {
    'solana-mainnet': 'https://explorer.solana.com',
    'solana-devnet': 'https://explorer.solana.com',
    'ethereum-mainnet': 'https://etherscan.io',
    'ethereum-sepolia': 'https://sepolia.etherscan.io', 
    'polygon-mainnet': 'https://polygonscan.com'
  };
  
  const baseUrl = baseUrls[chainId];
  return `${baseUrl}/tx/${signature}`;
}