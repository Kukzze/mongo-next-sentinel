export interface SentinelConfig {
  /**
   * Maximum allowed duration (in milliseconds) a connection can stay checked out before triggering a leak warning.
   * Default: 5000ms.
   */
  leakThresholdMs?: number;

  /**
   * Maximum allowed active connections in the pool before emitting a pool pressure warning.
   * Default: 80% of maxPoolSize or 80.
   */
  poolPressureThreshold?: number;

  /**
   * Callback invoked whenever a connection leak or potential exhaustion is detected.
   */
  onLeakDetected?: (warning: LeakWarning) => void;

  /**
   * Callback invoked on connection pool state changes.
   */
  onMetricsUpdate?: (metrics: PoolMetrics) => void;

  /**
   * Enable verbose diagnostic logging to stdout.
   * Default: false in production, true in development.
   */
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
  stack?: string;
  timestamp: Date;
}
