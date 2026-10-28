import type { PoolMetrics } from './types';

export interface DiagnosticSnapshot {
  timestamp: string;
  version: string;
  metrics: PoolMetrics;
  activeCheckoutsCount: number;
}

export function createDiagnosticSnapshot(metrics: PoolMetrics, activeCount: number): DiagnosticSnapshot {
  return {
    timestamp: new Date().toISOString(),
    version: '1.1.0',
    metrics: { ...metrics },
    activeCheckoutsCount: activeCount
  };
}
