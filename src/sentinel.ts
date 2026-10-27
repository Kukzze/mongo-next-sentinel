import type { MongoClient } from 'mongodb';
import type { SentinelConfig, PoolMetrics, LeakWarning } from './types';

interface TrackedCheckout {
  connectionId: number | string;
  checkedOutAt: number;
  timer: any;
}

export class MongoSentinel {
  private client: MongoClient;
  private config: Required<SentinelConfig>;
  private checkouts = new Map<number | string, TrackedCheckout>();
  private metrics: PoolMetrics = {
    totalCreated: 0,
    totalClosed: 0,
    currentActive: 0,
    currentAvailable: 0,
    peakActive: 0,
    checkoutWaitCount: 0,
  };

  constructor(client: MongoClient, config: SentinelConfig = {}) {
    this.client = client;
    this.config = {
      leakThresholdMs: config.leakThresholdMs ?? 5000,
      poolPressureThreshold: config.poolPressureThreshold ?? 80,
      onLeakDetected: config.onLeakDetected ?? ((warning) => {
        console.warn(`[MongoSentinel:WARN] Potential connection leak detected! Connection #${warning.connectionId} checked out for ${warning.checkedOutDurationMs}ms (threshold: ${warning.thresholdMs}ms)`);
      }),
      onMetricsUpdate: config.onMetricsUpdate ?? (() => {}),
      debug: config.debug ?? (process.env.NODE_ENV !== 'production'),
    };

    this.attachListeners();
  }

  private attachListeners(): void {
    // Track connection lifecycle
    this.client.on('connectionCreated', (event: any) => {
      this.metrics.totalCreated++;
      this.metrics.currentAvailable++;
      this.notifyUpdate();
      if (this.config.debug) {
        console.info(`[MongoSentinel:INFO] Connection created (id: ${event.connectionId}, pool size: ${this.metrics.currentAvailable})`);
      }
    });

    this.client.on('connectionClosed', (event: any) => {
      this.metrics.totalClosed++;
      if (this.metrics.currentAvailable > 0) {
        this.metrics.currentAvailable--;
      }
      this.notifyUpdate();
    });

    // Track checkout start & duration
    this.client.on('connectionCheckOutStarted', () => {
      this.metrics.checkoutWaitCount++;
      this.notifyUpdate();
    });

    this.client.on('connectionCheckedOut', (event: any) => {
      this.metrics.currentActive++;
      if (this.metrics.currentAvailable > 0) {
        this.metrics.currentAvailable--;
      }
      if (this.metrics.currentActive > this.metrics.peakActive) {
        this.metrics.peakActive = this.metrics.currentActive;
      }

      const connectionId = event.connectionId;
      const checkedOutAt = Date.now();

      // Schedule leak detector timer
      const timer: any = setTimeout(() => {
        if (this.checkouts.has(connectionId)) {
          const duration = Date.now() - checkedOutAt;
          this.config.onLeakDetected({
            connectionId,
            checkedOutDurationMs: duration,
            thresholdMs: this.config.leakThresholdMs,
            timestamp: new Date(),
          });
        }
      }, this.config.leakThresholdMs);

      if (timer && typeof timer.unref === 'function') {
        timer.unref();
      }

      this.checkouts.set(connectionId, {
        connectionId,
        checkedOutAt,
        timer,
      });

      this.notifyUpdate();
    });

    this.client.on('connectionCheckedIn', (event: any) => {
      const tracked = this.checkouts.get(event.connectionId);
      if (tracked) {
        clearTimeout(tracked.timer);
        this.checkouts.delete(event.connectionId);
      }

      if (this.metrics.currentActive > 0) {
        this.metrics.currentActive--;
      }
      this.metrics.currentAvailable++;
      this.notifyUpdate();
    });

    this.client.on('connectionPoolClosed', () => {
      this.destroy();
    });
  }

  public getMetrics(): Readonly<PoolMetrics> {
    return { ...this.metrics };
  }

  public getActiveCheckoutsCount(): number {
    return this.checkouts.size;
  }

  public destroy(): void {
    for (const [, tracked] of this.checkouts) {
      clearTimeout(tracked.timer);
    }
    this.checkouts.clear();
  }

  private notifyUpdate(): void {
    this.config.onMetricsUpdate(this.getMetrics());
  }
}
