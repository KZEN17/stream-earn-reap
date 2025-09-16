// QA Audit System for CLIP App
// Implements checklist items 1, 2, and 3

export interface CTAElement {
  id: string;
  type: 'button' | 'link' | 'navigation';
  text: string;
  route?: string;
  action?: string;
  component: string;
  file: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface TransactionRiskPoint {
  id: string;
  element: string;
  action: string;
  valueMovement: 'user_wallet' | 'campaign_budget' | 'card_topup';
  method?: string;
  chain?: string;
  contract?: string;
  address?: string;
  spender?: string;
  amount?: string;
  maxSlippage?: number;
  decimals?: number;
  idempotencyKey?: string;
  environment: 'development' | 'staging' | 'production';
}

export interface PaymentSourceLogic {
  action: string;
  source: 'user_wallet' | 'campaign_budget';
  guardrails: string[];
  testCases: string[];
}

// 1. CTA AUDIT REGISTRY
export const CTA_AUDIT_REGISTRY: CTAElement[] = [
  // Navigation CTAs
  {
    id: 'nav-home',
    type: 'navigation',
    text: 'Home',
    route: '/',
    component: 'AppSidebar',
    file: 'src/components/AppSidebar.tsx',
    riskLevel: 'low'
  },
  {
    id: 'nav-rewards',
    type: 'navigation', 
    text: 'Rewards',
    route: '/rewards',
    component: 'AppSidebar',
    file: 'src/components/AppSidebar.tsx',
    riskLevel: 'low'
  },
  {
    id: 'nav-profile',
    type: 'navigation',
    text: 'Profile',
    route: '/profile',
    component: 'AppSidebar',
    file: 'src/components/AppSidebar.tsx',
    riskLevel: 'low'
  },
  {
    id: 'nav-raidchat',
    type: 'navigation',
    text: 'Raid Chat',
    route: '/raid-chat',
    component: 'AppSidebar',
    file: 'src/components/AppSidebar.tsx',
    riskLevel: 'medium'
  },
  {
    id: 'login-button',
    type: 'button',
    text: 'Login',
    action: 'authenticate',
    component: 'LoginModal',
    file: 'src/components/LoginModal.tsx',
    riskLevel: 'medium'
  },
  {
    id: 'create-campaign',
    type: 'button',
    text: 'Create Campaign',
    route: '/create-campaign',
    component: 'CampaignCreator',
    file: 'src/components/campaign/CampaignCreator.tsx',
    riskLevel: 'high'
  },
  // TODO: Add wallet-related CTAs when implemented
  {
    id: 'connect-wallet',
    type: 'button',
    text: 'Connect Wallet',
    action: 'connect_wallet',
    component: 'WalletConnect',
    file: 'src/components/wallet/WalletConnect.tsx',
    riskLevel: 'critical'
  },
  {
    id: 'donate-button',
    type: 'button',
    text: 'Donate',
    action: 'donate',
    component: 'DonateModal',
    file: 'src/components/payments/DonateModal.tsx',
    riskLevel: 'critical'
  },
  {
    id: 'payout-button',
    type: 'button',
    text: 'Payout',
    action: 'payout',
    component: 'PayoutDashboard',
    file: 'src/components/campaign/PayoutDashboard.tsx',
    riskLevel: 'critical'
  },
  {
    id: 'claim-button',
    type: 'button',
    text: 'Claim',
    action: 'claim_reward',
    component: 'RewardClaim',
    file: 'src/components/rewards/RewardClaim.tsx',
    riskLevel: 'critical'
  }
];

// 2. TRANSACTION RISK POINTS MATRIX
export const TRANSACTION_RISK_MATRIX: TransactionRiskPoint[] = [
  // User Wallet → Value Movement
  {
    id: 'user-donate',
    element: 'donate-button',
    action: 'donate',
    valueMovement: 'user_wallet',
    method: 'transfer',
    chain: 'solana',
    contract: 'donation_contract',
    environment: 'development'
  },
  {
    id: 'user-tip',
    element: 'tip-button',
    action: 'tip',
    valueMovement: 'user_wallet', 
    method: 'transfer',
    chain: 'solana',
    environment: 'development'
  },
  {
    id: 'user-approval',
    element: 'approve-button',
    action: 'approve',
    valueMovement: 'user_wallet',
    method: 'approve',
    spender: 'campaign_contract',
    environment: 'development'
  },
  {
    id: 'user-gas',
    element: 'any-tx-button',
    action: 'gas_payment',
    valueMovement: 'user_wallet',
    method: 'gas',
    chain: 'solana',
    environment: 'development'
  },
  
  // Campaign Budget → Value Movement  
  {
    id: 'campaign-payout',
    element: 'payout-button',
    action: 'payout',
    valueMovement: 'campaign_budget',
    method: 'transfer',
    chain: 'solana',
    environment: 'development'
  },
  {
    id: 'campaign-refund',
    element: 'refund-button', 
    action: 'refund',
    valueMovement: 'campaign_budget',
    method: 'transfer',
    environment: 'development'
  },
  {
    id: 'campaign-rebate',
    element: 'rebate-button',
    action: 'rebate', 
    valueMovement: 'campaign_budget',
    method: 'transfer',
    environment: 'development'
  },
  {
    id: 'campaign-fee-subsidy',
    element: 'sponsor-fee-button',
    action: 'sponsor_fee',
    valueMovement: 'campaign_budget',
    method: 'transfer',
    environment: 'development'
  },

  // Card Top-up → Value Movement
  {
    id: 'card-authorization',
    element: 'topup-button',
    action: 'card_auth',
    valueMovement: 'card_topup',
    method: 'card_authorization',
    environment: 'development'
  },
  {
    id: 'card-settlement',
    element: 'topup-button',
    action: 'card_settle',
    valueMovement: 'card_topup',
    method: 'card_settlement',
    environment: 'development'
  },
  {
    id: 'card-reversal',
    element: 'refund-card-button',
    action: 'card_reverse',
    valueMovement: 'card_topup', 
    method: 'card_reversal',
    environment: 'development'
  }
];

// 3. PAYMENT SOURCE LOGIC ("Logic X")
export const PAYMENT_SOURCE_LOGIC: PaymentSourceLogic[] = [
  {
    action: 'donate',
    source: 'user_wallet',
    guardrails: [
      'require_connected_wallet',
      'network_match',
      'simulate_transaction',
      'show_breakdown_modal',
      'explicit_confirm',
      'check_balance',
      'cap_max_per_txn',
      'daily_cap',
      'idempotency_key',
      'dry_run_mode_staging'
    ],
    testCases: [
      'budget_zero_block',
      'insufficient_funds_block', 
      'wrong_chain_prompt',
      'repeated_clicks_single_tx',
      'wallet_cancel_rollback'
    ]
  },
  {
    action: 'tip',
    source: 'user_wallet',
    guardrails: [
      'require_connected_wallet',
      'network_match',
      'simulate_transaction',
      'show_breakdown_modal', 
      'explicit_confirm',
      'check_balance',
      'cap_max_per_txn',
      'daily_cap',
      'idempotency_key'
    ],
    testCases: [
      'insufficient_funds_block',
      'wrong_chain_prompt', 
      'repeated_clicks_single_tx',
      'wallet_cancel_rollback'
    ]
  },
  {
    action: 'payout',
    source: 'campaign_budget',
    guardrails: [
      'check_budget_remaining',
      'per_recipient_cap',
      'kyc_kyb_gate',
      'aml_allowlist',
      'simulate_amounts_bigint',
      'fee_breakdown_display',
      'idempotency_keys',
      'replay_protection_nonces',
      'webhook_verification_hmac',
      'audit_log'
    ],
    testCases: [
      'budget_zero_block',
      'budget_depleted_surface',
      'cap_exceeded_block',
      'kyc_gate_block'
    ]
  },
  {
    action: 'refund', 
    source: 'campaign_budget',
    guardrails: [
      'check_budget_remaining',
      'refund_eligibility',
      'time_window_check',
      'simulate_transaction',
      'idempotency_key',
      'audit_log'
    ],
    testCases: [
      'budget_zero_block',
      'ineligible_refund_block',
      'expired_window_block'
    ]
  },
  {
    action: 'sponsor_fee',
    source: 'campaign_budget', 
    guardrails: [
      'check_budget_remaining',
      'fee_calculation',
      'simulate_transaction',
      'idempotency_key'
    ],
    testCases: [
      'budget_zero_block',
      'insufficient_budget_block'
    ]
  },
  {
    action: 'free_order',
    source: 'campaign_budget',
    guardrails: [
      'check_budget_remaining',
      'eligibility_check',
      'usage_limits',
      'idempotency_key'
    ],
    testCases: [
      'budget_zero_block',
      'ineligible_user_block',
      'limit_exceeded_block'
    ]
  }
];

// Utility Functions
export function getPaymentSource(action: string): 'user_wallet' | 'campaign_budget' {
  const donateActions = ['donate', 'tip'];
  const budgetActions = ['payout', 'refund', 'sponsor_fee', 'free_order'];
  
  if (donateActions.includes(action)) {
    return 'user_wallet';
  } else if (budgetActions.includes(action)) {
    return 'campaign_budget';
  } else {
    return 'user_wallet'; // default fallback
  }
}

export function getGuardrails(action: string): string[] {
  const logic = PAYMENT_SOURCE_LOGIC.find(l => l.action === action);
  return logic?.guardrails || [];
}

export function getTestCases(action: string): string[] {
  const logic = PAYMENT_SOURCE_LOGIC.find(l => l.action === action);
  return logic?.testCases || [];
}

export function getCTAsByRiskLevel(riskLevel: CTAElement['riskLevel']): CTAElement[] {
  return CTA_AUDIT_REGISTRY.filter(cta => cta.riskLevel === riskLevel);
}

export function getTransactionRisksByMovement(movement: TransactionRiskPoint['valueMovement']): TransactionRiskPoint[] {
  return TRANSACTION_RISK_MATRIX.filter(risk => risk.valueMovement === movement);
}