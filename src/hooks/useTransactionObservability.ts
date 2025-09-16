import { useEffect, useCallback, useState } from 'react';
import type { TransactionEvent } from '@/lib/wallet/types';

interface ObservabilityMetrics {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  averageConfirmTime: number;
  budgetWarnings: number;
  budgetLocks: number;
}

interface TransactionFunnel {
  simulations: number;
  submissions: number;
  confirmations: number;
  failures: number;
  conversionRate: number;
}

export const useTransactionObservability = () => {
  const [events, setEvents] = useState<TransactionEvent[]>([]);
  const [metrics, setMetrics] = useState<ObservabilityMetrics>({
    totalTransactions: 0,
    successfulTransactions: 0,
    failedTransactions: 0,
    averageConfirmTime: 0,
    budgetWarnings: 0,
    budgetLocks: 0
  });

  // Event listener for transaction events
  useEffect(() => {
    const handleTransactionEvent = (event: CustomEvent) => {
      const txEvent: TransactionEvent = {
        eventType: event.detail.eventType,
        idempotencyKey: event.detail.idempotencyKey || `event_${Date.now()}`,
        source: event.detail.source || 'user_wallet',
        amountAtomic: event.detail.amountAtomic?.toString() || '0',
        chain: event.detail.chainId || event.detail.chain,
        ctaId: event.detail.ctaId || event.detail.campaignId || 'unknown',
        userId: event.detail.userId,
        sessionId: event.detail.sessionId || getSessionId(),
        timestamp: new Date(event.detail.timestamp || Date.now()),
        metadata: {
          ...event.detail,
          userAgent: navigator.userAgent,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          url: window.location.href
        }
      };

      setEvents(prev => [...prev.slice(-999), txEvent]); // Keep last 1000 events
      
      // Send to analytics endpoint (in production)
      if (process.env.NODE_ENV === 'production') {
        sendToAnalytics(txEvent);
      }
    };

    window.addEventListener('transaction_event', handleTransactionEvent as EventListener);
    window.addEventListener('budget_alert', handleTransactionEvent as EventListener);
    window.addEventListener('killswitch_updated', handleTransactionEvent as EventListener);

    return () => {
      window.removeEventListener('transaction_event', handleTransactionEvent as EventListener);
      window.removeEventListener('budget_alert', handleTransactionEvent as EventListener);
      window.removeEventListener('killswitch_updated', handleTransactionEvent as EventListener);
    };
  }, []);

  // Calculate metrics from events
  useEffect(() => {
    const newMetrics: ObservabilityMetrics = {
      totalTransactions: 0,
      successfulTransactions: 0,
      failedTransactions: 0,
      averageConfirmTime: 0,
      budgetWarnings: 0,
      budgetLocks: 0
    };

    const confirmTimes: number[] = [];
    const submissionTimes = new Map<string, number>();

    events.forEach(event => {
      switch (event.eventType) {
        case 'tx_submit':
          newMetrics.totalTransactions++;
          submissionTimes.set(event.idempotencyKey, event.timestamp.getTime());
          break;
          
        case 'tx_confirm':
          newMetrics.successfulTransactions++;
          const submitTime = submissionTimes.get(event.idempotencyKey);
          if (submitTime) {
            confirmTimes.push(event.timestamp.getTime() - submitTime);
          }
          break;
          
        case 'tx_fail':
          newMetrics.failedTransactions++;
          break;
          
        case 'budget_warn':
          newMetrics.budgetWarnings++;
          break;
          
        case 'budget_lock':
          newMetrics.budgetLocks++;
          break;
      }
    });

    // Calculate average confirmation time
    if (confirmTimes.length > 0) {
      newMetrics.averageConfirmTime = confirmTimes.reduce((a, b) => a + b, 0) / confirmTimes.length;
    }

    setMetrics(newMetrics);
  }, [events]);

  // Get transaction funnel data
  const getFunnelData = useCallback((): TransactionFunnel => {
    const eventCounts = events.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const simulations = eventCounts['tx_sim'] || 0;
    const submissions = eventCounts['tx_submit'] || 0;
    const confirmations = eventCounts['tx_confirm'] || 0;
    const failures = eventCounts['tx_fail'] || 0;

    return {
      simulations,
      submissions,
      confirmations,
      failures,
      conversionRate: simulations > 0 ? (confirmations / simulations) * 100 : 0
    };
  }, [events]);

  // Get top failure reasons
  const getTopFailures = useCallback((limit = 5) => {
    const failures = events
      .filter(e => e.eventType === 'tx_fail')
      .reduce((acc, event) => {
        const reason = event.metadata.error || 'Unknown error';
        acc[reason] = (acc[reason] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(failures)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([reason, count]) => ({ reason, count }));
  }, [events]);

  // Get budget burndown data
  const getBudgetBurndown = useCallback((campaignId: string) => {
    return events
      .filter(e => e.ctaId === campaignId && ['budget_warn', 'budget_lock'].includes(e.eventType))
      .map(event => ({
        timestamp: event.timestamp,
        balance: event.metadata.currentBalance || '0',
        threshold: event.metadata.threshold || 0,
        alertType: event.metadata.alertType || event.eventType
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [events]);

  // Manual event emission
  const emitEvent = useCallback((eventType: string, data: any) => {
    window.dispatchEvent(new CustomEvent('transaction_event', {
      detail: {
        eventType,
        timestamp: new Date(),
        sessionId: getSessionId(),
        ...data
      }
    }));
  }, []);

  // Export events as CSV for analysis
  const exportEvents = useCallback((startDate?: Date, endDate?: Date) => {
    const filteredEvents = events.filter(event => {
      if (startDate && event.timestamp < startDate) return false;
      if (endDate && event.timestamp > endDate) return false;
      return true;
    });

    const csv = [
      // Header
      'timestamp,eventType,idempotencyKey,source,amountAtomic,chain,ctaId,userId,sessionId,error,duration',
      
      // Data rows
      ...filteredEvents.map(event => [
        event.timestamp.toISOString(),
        event.eventType,
        event.idempotencyKey,
        event.source,
        event.amountAtomic,
        event.chain,
        event.ctaId,
        event.userId || '',
        event.sessionId,
        event.metadata.error || '',
        event.metadata.duration || ''
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaction-events-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [events]);

  return {
    events,
    metrics,
    getFunnelData,
    getTopFailures,
    getBudgetBurndown,
    emitEvent,
    exportEvents
  };
};

// Helper functions
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('clip_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('clip_session_id', sessionId);
  }
  return sessionId;
}

async function sendToAnalytics(event: TransactionEvent) {
  try {
    // In production, send to your analytics endpoint
    await fetch('/api/analytics/transaction-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event)
    });
  } catch (error) {
    console.warn('Failed to send analytics event:', error);
  }
}

// Performance monitoring hook
export const useTransactionPerformance = () => {
  const [performanceData, setPerformanceData] = useState({
    p95ConfirmTime: 0,
    successRate: 0,
    avgGasFee: '0',
    chainPerformance: {} as Record<string, {
      avgConfirmTime: number;
      successRate: number;
      sampleSize: number;
    }>
  });

  const { events } = useTransactionObservability();

  useEffect(() => {
    const confirmTimes: number[] = [];
    const chainStats: Record<string, {
      confirmTimes: number[];
      successes: number;
      total: number;
      totalGas: bigint;
    }> = {};

    const submissionTimes = new Map<string, number>();
    let totalSuccesses = 0;
    let totalTransactions = 0;

    events.forEach(event => {
      if (!chainStats[event.chain]) {
        chainStats[event.chain] = {
          confirmTimes: [],
          successes: 0,
          total: 0,
          totalGas: BigInt(0)
        };
      }

      switch (event.eventType) {
        case 'tx_submit':
          submissionTimes.set(event.idempotencyKey, event.timestamp.getTime());
          chainStats[event.chain].total++;
          totalTransactions++;
          break;
          
        case 'tx_confirm':
          const submitTime = submissionTimes.get(event.idempotencyKey);
          if (submitTime) {
            const confirmTime = event.timestamp.getTime() - submitTime;
            confirmTimes.push(confirmTime);
            chainStats[event.chain].confirmTimes.push(confirmTime);
          }
          chainStats[event.chain].successes++;
          totalSuccesses++;
          
          if (event.metadata.actualFee) {
            chainStats[event.chain].totalGas += BigInt(event.metadata.actualFee);
          }
          break;
      }
    });

    // Calculate P95 confirmation time
    const sortedTimes = confirmTimes.sort((a, b) => a - b);
    const p95Index = Math.floor(sortedTimes.length * 0.95);
    const p95ConfirmTime = sortedTimes[p95Index] || 0;

    // Calculate success rate
    const successRate = totalTransactions > 0 ? (totalSuccesses / totalTransactions) * 100 : 0;

    // Calculate chain-specific performance
    const chainPerformance: Record<string, any> = {};
    Object.entries(chainStats).forEach(([chain, stats]) => {
      if (stats.total > 0) {
        const avgConfirmTime = stats.confirmTimes.length > 0 
          ? stats.confirmTimes.reduce((a, b) => a + b, 0) / stats.confirmTimes.length
          : 0;
        
        chainPerformance[chain] = {
          avgConfirmTime,
          successRate: (stats.successes / stats.total) * 100,
          sampleSize: stats.total
        };
      }
    });

    setPerformanceData({
      p95ConfirmTime,
      successRate,
      avgGasFee: '0', // Calculate from chainStats if needed
      chainPerformance
    });

  }, [events]);

  return performanceData;
};