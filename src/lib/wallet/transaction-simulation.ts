// P0: Transaction Simulation Before Sign
import React from 'react';
import type { 
  TransactionSimulation, 
  TransactionRequest, 
  TokenChange,
  ChainId 
} from './types';

interface SimulationConfig {
  rpcEndpoints: Record<ChainId, string[]>;
  timeoutMs: number;
  retryAttempts: number;
}

// Chain configurations with proper decimals
export const CHAIN_CONFIGS = {
  'solana-mainnet': {
    decimals: 9,
    nativeSymbol: 'SOL',
    usdcMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    explorerUrl: 'https://solscan.io/tx/',
    rpcUrls: [
      'https://api.mainnet-beta.solana.com',
      'https://solana-api.projectserum.com'
    ]
  },
  'solana-devnet': {
    decimals: 9,
    nativeSymbol: 'SOL',
    usdcMint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU', // Devnet USDC
    explorerUrl: 'https://solscan.io/tx/',
    rpcUrls: [
      'https://api.devnet.solana.com'
    ]
  },
  'ethereum-mainnet': {
    decimals: 18,
    nativeSymbol: 'ETH',
    usdcMint: '0xA0b86a33E6417Fa048aEDdB9A76D2E1d7d8536f4', // USDC on Ethereum
    explorerUrl: 'https://etherscan.io/tx/',
    rpcUrls: [
      'https://eth-mainnet.g.alchemy.com/v2/demo',
      'https://cloudflare-eth.com'
    ]
  },
  'ethereum-sepolia': {
    decimals: 18,
    nativeSymbol: 'ETH',
    usdcMint: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Sepolia USDC
    explorerUrl: 'https://sepolia.etherscan.io/tx/',
    rpcUrls: [
      'https://eth-sepolia.g.alchemy.com/v2/demo'
    ]
  },
  'polygon-mainnet': {
    decimals: 18,
    nativeSymbol: 'MATIC',
    usdcMint: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC on Polygon
    explorerUrl: 'https://polygonscan.com/tx/',
    rpcUrls: [
      'https://polygon-rpc.com',
      'https://matic-mainnet.chainstacklabs.com'
    ]
  }
} as const;

// Amount utilities with proper decimal handling
export class AmountUtils {
  static toBigInt(amount: string | number, decimals: number): bigint {
    if (typeof amount === 'number') {
      amount = amount.toString();
    }
    
    // Handle decimal strings
    const [whole, fraction = ''] = amount.split('.');
    const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
    
    return BigInt(whole + paddedFraction);
  }
  
  static fromBigInt(amount: bigint, decimals: number): string {
    const divisor = BigInt(10 ** decimals);
    const whole = amount / divisor;
    const remainder = amount % divisor;
    
    if (remainder === BigInt(0)) {
      return whole.toString();
    }
    
    const fractionStr = remainder.toString().padStart(decimals, '0');
    const trimmedFraction = fractionStr.replace(/0+$/, '');
    
    return trimmedFraction.length > 0 
      ? `${whole}.${trimmedFraction}`
      : whole.toString();
  }
  
  static formatDisplay(amount: bigint, decimals: number, symbol: string): string {
    const formatted = this.fromBigInt(amount, decimals);
    return `${formatted} ${symbol}`;
  }
  
  // Boundary tests for safe arithmetic
  static isSafeAmount(amount: bigint, decimals: number): boolean {
    const maxSafe = BigInt(Number.MAX_SAFE_INTEGER);
    const minAmount = BigInt(1); // 1 atomic unit minimum
    const maxAmount = maxSafe / BigInt(10 ** decimals); // Reasonable max
    
    return amount >= minAmount && amount <= maxAmount;
  }
  
  static validateAmount(amount: bigint, decimals: number, context: string): void {
    if (amount <= BigInt(0)) {
      throw new Error(`${context}: Amount must be positive`);
    }
    
    if (!this.isSafeAmount(amount, decimals)) {
      throw new Error(`${context}: Amount exceeds safe limits`);
    }
  }
}

// Transaction simulation service
export class TransactionSimulator {
  private config: SimulationConfig;
  
  constructor(config?: Partial<SimulationConfig>) {
    this.config = {
      rpcEndpoints: Object.fromEntries(
        Object.entries(CHAIN_CONFIGS).map(([chain, config]) => [
          chain, 
          [...config.rpcUrls] // Convert readonly arrays to mutable arrays
        ])
      ) as Record<ChainId, string[]>,
      timeoutMs: 15000,
      retryAttempts: 2,
      ...config
    };
  }
  
  async simulate(request: TransactionRequest): Promise<TransactionSimulation> {
    const simulationId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    try {
      // Emit simulation start event
      this.emitEvent('tx_sim', {
        simulationId,
        idempotencyKey: request.idempotencyKey,
        action: request.action,
        chainId: request.chainId,
        amountAtomic: request.amount.toString(),
        tokenMint: request.tokenMint,
        fromAddress: request.fromAddress,
        toAddress: request.toAddress,
        timestamp: new Date()
      });
      
      // Get chain configuration
      const chainConfig = CHAIN_CONFIGS[request.chainId];
      if (!chainConfig) {
        throw new Error(`Unsupported chain: ${request.chainId}`);
      }
      
      // Validate amount boundaries
      AmountUtils.validateAmount(
        request.amount, 
        chainConfig.decimals, 
        `Transaction simulation for ${request.action}`
      );
      
      // Perform chain-specific simulation
      const result = await this.simulateByChain(request, chainConfig, simulationId);
      
      // Emit success event
      this.emitEvent('tx_sim', {
        ...result,
        simulationId,
        idempotencyKey: request.idempotencyKey,
        success: result.success,
        duration: Date.now() - startTime,
        timestamp: new Date()
      });
      
      return result;
      
    } catch (error) {
      // Emit failure event
      this.emitEvent('tx_sim', {
        simulationId,
        idempotencyKey: request.idempotencyKey,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        timestamp: new Date()
      });
      
      // Return failed simulation with error details
      return {
        success: false,
        estimatedGas: undefined,
        estimatedFee: undefined,
        changes: [],
        warnings: [],
        errors: [error instanceof Error ? error.message : 'Simulation failed'],
        simulationId
      };
    }
  }
  
  private async simulateByChain(
    request: TransactionRequest, 
    chainConfig: typeof CHAIN_CONFIGS[ChainId],
    simulationId: string
  ): Promise<TransactionSimulation> {
    
    if (request.chainId.includes('solana')) {
      return this.simulateSolana(request, chainConfig, simulationId);
    } else {
      return this.simulateEVM(request, chainConfig, simulationId);
    }
  }
  
  private async simulateSolana(
    request: TransactionRequest, 
    chainConfig: typeof CHAIN_CONFIGS[ChainId],
    simulationId: string
  ): Promise<TransactionSimulation> {
    
    // For now, return a mock simulation
    // In production, this would use @solana/web3.js simulation
    const changes: TokenChange[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];
    
    // Mock gas estimation for Solana (in lamports)
    const estimatedGas = BigInt(5000); // 5000 lamports base fee
    const estimatedFee = estimatedGas; // On Solana, gas == fee
    
    // Simulate token changes
    if (request.action === 'donate' || request.action === 'tip') {
      // Outgoing USDC
      changes.push({
        mint: request.tokenMint,
        symbol: 'USDC',
        decimals: 6, // USDC has 6 decimals
        change: -request.amount,
        uiAmount: `-${AmountUtils.fromBigInt(request.amount, 6)}`
      });
      
      // SOL fee
      changes.push({
        mint: 'So11111111111111111111111111111111111111112', // SOL mint
        symbol: 'SOL',
        decimals: 9,
        change: -estimatedFee,
        uiAmount: `-${AmountUtils.fromBigInt(estimatedFee, 9)}`
      });
    }
    
    // Check account balance (mock)
    const mockBalance = BigInt(100_000_000); // 100 USDC in atomic units
    if (request.amount > mockBalance) {
      errors.push('Insufficient token balance');
    }
    
    // Check SOL balance for fees (mock)
    const mockSolBalance = BigInt(100_000_000); // 0.1 SOL
    if (estimatedFee > mockSolBalance) {
      errors.push('Insufficient SOL for transaction fees');
    }
    
    // Warnings for high fees
    if (estimatedFee > BigInt(10_000)) { // More than 0.00001 SOL
      warnings.push('Transaction fee is higher than expected');
    }
    
    return {
      success: errors.length === 0,
      estimatedGas,
      estimatedFee,
      changes,
      warnings,
      errors,
      simulationId
    };
  }
  
  private async simulateEVM(
    request: TransactionRequest, 
    chainConfig: typeof CHAIN_CONFIGS[ChainId],
    simulationId: string
  ): Promise<TransactionSimulation> {
    
    // Mock EVM simulation
    // In production, this would use ethers.js or web3.js simulation
    const changes: TokenChange[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];
    
    // Mock gas estimation (in wei for ETH, gwei for others)
    const gasLimit = BigInt(21000); // Standard transfer
    const gasPrice = BigInt(20_000_000_000); // 20 gwei
    const estimatedGas = gasLimit;
    const estimatedFee = gasLimit * gasPrice;
    
    // Simulate token changes
    if (request.action === 'donate' || request.action === 'tip') {
      // Outgoing USDC (6 decimals)
      changes.push({
        mint: request.tokenMint,
        symbol: 'USDC',
        decimals: 6,
        change: -request.amount,
        uiAmount: `-${AmountUtils.fromBigInt(request.amount, 6)}`
      });
      
      // ETH/MATIC fee
      changes.push({
        mint: '0x0000000000000000000000000000000000000000', // Native token
        symbol: chainConfig.nativeSymbol,
        decimals: chainConfig.decimals,
        change: -estimatedFee,
        uiAmount: `-${AmountUtils.fromBigInt(estimatedFee, chainConfig.decimals)}`
      });
    }
    
    // Mock balance checks
    const mockUsdcBalance = BigInt(1000_000_000); // 1000 USDC
    if (request.amount > mockUsdcBalance) {
      errors.push('Insufficient USDC balance');
    }
    
    const mockNativeBalance = BigInt(100_000_000_000_000_000); // 0.1 ETH/MATIC
    if (estimatedFee > mockNativeBalance) {
      errors.push(`Insufficient ${chainConfig.nativeSymbol} for gas fees`);
    }
    
    // Warnings for high gas
    const highGasThreshold = BigInt(50_000_000_000_000_000); // 0.05 ETH
    if (estimatedFee > highGasThreshold) {
      warnings.push('Gas fee is unusually high');
    }
    
    return {
      success: errors.length === 0,
      estimatedGas,
      estimatedFee,
      changes,
      warnings,
      errors,
      simulationId
    };
  }
  
  // Event emission for observability
  private emitEvent(type: string, data: any) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('transaction_event', {
        detail: {
          eventType: type,
          ...data
        }
      }));
    }
    
    // Log for debugging
    console.log(`[TransactionSimulator] ${type}:`, data);
  }
}

// Global simulator instance
export const transactionSimulator = new TransactionSimulator();

// Utility hooks for React components
export const useTransactionSimulation = () => {
  const [simulation, setSimulation] = React.useState<TransactionSimulation | null>(null);
  const [loading, setLoading] = React.useState(false);
  
  const simulate = async (request: TransactionRequest) => {
    setLoading(true);
    try {
      const result = await transactionSimulator.simulate(request);
      setSimulation(result);
      return result;
    } finally {
      setLoading(false);
    }
  };
  
  const reset = () => {
    setSimulation(null);
    setLoading(false);
  };
  
  return {
    simulation,
    loading,
    simulate,
    reset
  };
};