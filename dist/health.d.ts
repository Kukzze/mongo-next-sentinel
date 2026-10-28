import type { PoolMetrics } from './types';
export interface PoolHealthStatus {
    status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
    utilizationPercent: number;
    activeCount: number;
    availableCount: number;
}
export declare function evaluatePoolHealth(metrics: PoolMetrics, maxPoolSize?: number): PoolHealthStatus;
//# sourceMappingURL=health.d.ts.map