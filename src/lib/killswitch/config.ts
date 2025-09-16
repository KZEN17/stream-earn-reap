// P0: Kill Switches & Budget Floor Protection
import { create } from 'zustand';
import type { KillSwitchConfig, BudgetAlert, ChainId } from '../wallet/types';

interface KillSwitchState {
  config: KillSwitchConfig;
  budgetAlerts: BudgetAlert[];
  
  // Actions
  updateKillSwitch: (updates: Partial<KillSwitchConfig>) => void;
  isActionBlocked: (action: string, chainId?: ChainId) => boolean;
  addBudgetAlert: (alert: BudgetAlert) => void;
  checkBudgetFloor: (campaignId: string, currentBalance: bigint, totalBudget: bigint) => void;
  clearBudgetAlerts: (campaignId: string) => void;
}

// Environment-based kill switch defaults
const getDefaultKillSwitchConfig = (): KillSwitchConfig => {
  const isDev = import.meta.env.DEV;
  const disableTx = import.meta.env.VITE_DISABLE_TX === 'true';
  
  return {
    globalTxDisabled: disableTx || false,
    disabledActions: [],
    disabledChains: isDev ? [] : ['solana-devnet', 'ethereum-sepolia'], // Block testnets in production
    maintenanceMode: false,
    budgetFloorPct: 5 // Auto-lock at 5% remaining budget
  };
};

export const useKillSwitch = create<KillSwitchState>((set, get) => ({
  config: getDefaultKillSwitchConfig(),
  budgetAlerts: [],

  updateKillSwitch: (updates) => {
    set(state => ({
      config: { ...state.config, ...updates }
    }));
    
    // Log kill switch changes for audit
    console.warn('Kill switch updated:', updates);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('killswitch_updated', {
        detail: { updates, timestamp: new Date() }
      }));
    }
  },

  isActionBlocked: (action: string, chainId?: ChainId) => {
    const { config } = get();
    
    // Global kill switch
    if (config.globalTxDisabled) {
      return true;
    }
    
    // Maintenance mode
    if (config.maintenanceMode) {
      return true;
    }
    
    // Action-specific blocks
    if (config.disabledActions.includes(action)) {
      return true;
    }
    
    // Chain-specific blocks
    if (chainId && config.disabledChains.includes(chainId)) {
      return true;
    }
    
    return false;
  },

  addBudgetAlert: (alert) => {
    set(state => ({
      budgetAlerts: [...state.budgetAlerts.filter(a => 
        !(a.campaignId === alert.campaignId && a.alertType === alert.alertType)
      ), alert]
    }));
    
    // Emit budget alert event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('budget_alert', {
        detail: alert
      }));
    }
  },

  checkBudgetFloor: (campaignId: string, currentBalance: bigint, totalBudget: bigint) => {
    const { config } = get();
    
    if (totalBudget === BigInt(0)) {
      return; // Avoid division by zero
    }
    
    const balancePct = Number(currentBalance * BigInt(100) / totalBudget);
    
    // Check thresholds and trigger appropriate alerts
    if (balancePct <= 0) {
      // Budget depleted - auto-lock
      get().addBudgetAlert({
        campaignId,
        currentBalance,
        threshold: 0,
        alertType: 'locked',
        triggeredAt: new Date()
      });
      
      // Emit budget lock event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('transaction_event', {
          detail: {
            eventType: 'budget_lock',
            campaignId,
            currentBalance: currentBalance.toString(),
            timestamp: new Date()
          }
        }));
      }
      
    } else if (balancePct <= config.budgetFloorPct) {
      // Critical threshold
      get().addBudgetAlert({
        campaignId,
        currentBalance,
        threshold: config.budgetFloorPct,
        alertType: 'critical',
        triggeredAt: new Date()
      });
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('transaction_event', {
          detail: {
            eventType: 'budget_warn',
            campaignId,
            currentBalance: currentBalance.toString(),
            threshold: config.budgetFloorPct,
            severity: 'critical',
            timestamp: new Date()
          }
        }));
      }
      
    } else if (balancePct <= 20) {
      // Warning threshold
      get().addBudgetAlert({
        campaignId,
        currentBalance,
        threshold: 20,
        alertType: 'warning',
        triggeredAt: new Date()
      });
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('transaction_event', {
          detail: {
            eventType: 'budget_warn',
            campaignId,
            currentBalance: currentBalance.toString(),
            threshold: 20,
            severity: 'warning',
            timestamp: new Date()
          }
        }));
      }
    }
  },

  clearBudgetAlerts: (campaignId: string) => {
    set(state => ({
      budgetAlerts: state.budgetAlerts.filter(alert => alert.campaignId !== campaignId)
    }));
  }
}));

// Feature flag helpers
export const FEATURE_FLAGS = {
  DONATE_ENABLED: 'donate_enabled',
  PAYOUT_ENABLED: 'payout_enabled', 
  TIP_ENABLED: 'tip_enabled',
  CLAIM_ENABLED: 'claim_enabled',
  FREE_ORDER_ENABLED: 'free_order_enabled'
} as const;

type FeatureFlag = typeof FEATURE_FLAGS[keyof typeof FEATURE_FLAGS];

// Feature flag state
interface FeatureFlagState {
  flags: Record<FeatureFlag, boolean>;
  updateFlag: (flag: FeatureFlag, enabled: boolean) => void;
  isFeatureEnabled: (flag: FeatureFlag) => boolean;
}

export const useFeatureFlags = create<FeatureFlagState>((set, get) => ({
  flags: {
    [FEATURE_FLAGS.DONATE_ENABLED]: true,
    [FEATURE_FLAGS.PAYOUT_ENABLED]: true,
    [FEATURE_FLAGS.TIP_ENABLED]: true,
    [FEATURE_FLAGS.CLAIM_ENABLED]: true,
    [FEATURE_FLAGS.FREE_ORDER_ENABLED]: false // Disabled by default
  },

  updateFlag: (flag, enabled) => {
    set(state => ({
      flags: { ...state.flags, [flag]: enabled }
    }));
    
    console.log(`Feature flag ${flag} ${enabled ? 'enabled' : 'disabled'}`);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('feature_flag_updated', {
        detail: { flag, enabled, timestamp: new Date() }
      }));
    }
  },

  isFeatureEnabled: (flag) => {
    const { flags } = get();
    return flags[flag] ?? false;
  }
}));

// Emergency kill switch function for immediate deployment
export const emergencyKillSwitch = {
  disableAllTransactions: () => {
    useKillSwitch.getState().updateKillSwitch({ globalTxDisabled: true });
    console.error('EMERGENCY: All transactions disabled');
  },
  
  enableMaintenanceMode: () => {
    useKillSwitch.getState().updateKillSwitch({ maintenanceMode: true });
    console.warn('MAINTENANCE: App in maintenance mode');
  },
  
  disableAction: (action: string) => {
    const { config } = useKillSwitch.getState();
    useKillSwitch.getState().updateKillSwitch({
      disabledActions: [...config.disabledActions, action]
    });
    console.warn(`ACTION DISABLED: ${action}`);
  },
  
  disableChain: (chainId: ChainId) => {
    const { config } = useKillSwitch.getState();
    useKillSwitch.getState().updateKillSwitch({
      disabledChains: [...config.disabledChains, chainId]
    });
    console.warn(`CHAIN DISABLED: ${chainId}`);
  }
};

// Expose emergency functions to window for runtime access
if (typeof window !== 'undefined') {
  (window as any).emergencyKillSwitch = emergencyKillSwitch;
}