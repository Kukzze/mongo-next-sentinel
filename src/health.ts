import type { PoolMetrics } from './types';

export interface PoolHealthStatus {
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  utilizationPercent: number;
  activeCount: number;
  availableCount: number;
}

export function evaluatePoolHealth(metrics: PoolMetrics, maxPoolSize = 100): PoolHealthStatus {
  const total = metrics.currentActive + metrics.currentAvailable;
  const utilization = total > 0 ? (metrics.currentActive / total) * 100 : 0;
  let status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL' = 'HEALTHY';
  if (utilization > 90 || metrics.checkoutWaitCount > 50) {
    status = 'CRITICAL';
  } else if (utilization > 70 || metrics.checkoutWaitCount > 10) {
    status = 'DEGRADED';
  }
  return {
    status,
    utilizationPercent: Math.round(utilization),
    activeCount: metrics.currentActive,
    availableCount: metrics.currentAvailable
  };
}
