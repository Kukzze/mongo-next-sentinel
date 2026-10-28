export interface SentinelConfig {
    leakThresholdMs?: number;
    poolPressureThreshold?: number;
    onLeakDetected?: (warning: LeakWarning) => void;
    onMetricsUpdate?: (metrics: PoolMetrics) => void;
    debug?: boolean;
}
export interface PoolMetrics {
    totalCreated: number;
    totalClosed: number;
    currentActive: number;
    currentAvailable: number;
    peakActive: number;
    checkoutWaitCount: number;
}
export interface LeakWarning {
    connectionId: number | string;
    checkedOutDurationMs: number;
    thresholdMs: number;
    timestamp: Date;
}
export interface CmapConnectionEvent {
    connectionId: number | string;
    address?: string;
    reason?: string;
}
//# sourceMappingURL=types.d.ts.map