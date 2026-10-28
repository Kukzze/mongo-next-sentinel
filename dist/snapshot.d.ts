import type { PoolMetrics } from './types';
export interface DiagnosticSnapshot {
    timestamp: string;
    version: string;
    metrics: PoolMetrics;
    activeCheckoutsCount: number;
}
export declare function createDiagnosticSnapshot(metrics: PoolMetrics, activeCount: number): DiagnosticSnapshot;
//# sourceMappingURL=snapshot.d.ts.map