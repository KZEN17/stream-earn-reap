// P0: Wallet + Transaction Layer Types
export type ChainId = 'solana-mainnet' | 'solana-devnet' | 'ethereum-mainnet' | 'ethereum-sepolia' | 'polygon-mainnet';

export interface WalletConnection {
  address: string;
  chainId: ChainId;
  provider: string; // 'phantom', 'okx', 'metamask', etc.
  isConnected: boolean;
}

export interface TransactionSimulation {
  success: boolean;
  estimatedGas?: bigint;
  estimatedFee?: bigint;
  changes: TokenChange[];
  warnings: string[];
  errors: string[];
  simulationId: string;
}

export interface TokenChange {
  mint: string;
  symbol: string;
  decimals: number;
  change: bigint; // atomic units, negative for outgoing
  uiAmount: string; // human readable
}

export interface TransactionRequest {
  id: string;
  action: 'donate' | 'payout' | 'approve' | 'tip' | 'claim';
  source: 'user_wallet' | 'campaign_budget';
  fromAddress: string;
  toAddress?: string;
  tokenMint: string;
  amount: bigint; // atomic units
  decimals: number;
  chainId: ChainId;
  metadata: Record<string, any>;
  idempotencyKey: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface TransactionResult {
  txId: string;
  signature: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  gasUsed?: bigint;
  actualFee?: bigint;
  confirmationTime?: Date;
  explorerUrl: string;
  error?: string;
}

export interface ActionCaps {
  perTx: bigint;
  perDay: bigint;
  perWallet: bigint;
  perCampaign?: bigint;
}

export interface RateSnapshot {
  tokenPair: string;
  rate: string; // decimal string to preserve precision
  slippageBps: number;
  timestamp: Date;
  source: string;
}

// Kill Switch Types
export interface KillSwitchConfig {
  globalTxDisabled: boolean;
  disabledActions: string[];
  disabledChains: ChainId[];
  maintenanceMode: boolean;
  budgetFloorPct: number; // percentage at which to auto-lock
}

export interface BudgetAlert {
  campaignId: string;
  currentBalance: bigint;
  threshold: number; // percentage
  alertType: 'warning' | 'critical' | 'locked';
  triggeredAt: Date;
}

// Security Types
export interface AddressAllowlist {
  chainId: ChainId;
  addresses: string[];
  environment: 'development' | 'staging' | 'production';
}

export interface WebhookSignature {
  payload: string;
  signature: string;
  timestamp: number;
}

// Observability Types
export interface TransactionEvent {
  eventType: 'tx_sim' | 'tx_submit' | 'tx_confirm' | 'tx_fail' | 'budget_warn' | 'budget_lock';
  idempotencyKey: string;
  source: 'user_wallet' | 'campaign_budget' | 'card_topup';
  amountAtomic: string;
  chain: ChainId;
  ctaId: string;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  metadata: Record<string, any>;
}