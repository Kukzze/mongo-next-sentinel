// src/sentinel.ts
class MongoSentinel {
  client;
  config;
  checkouts = new Map;
  metrics = {
    totalCreated: 0,
    totalClosed: 0,
    currentActive: 0,
    currentAvailable: 0,
    peakActive: 0,
    checkoutWaitCount: 0
  };
  constructor(client, config = {}) {
    this.client = client;
    this.config = {
      leakThresholdMs: config.leakThresholdMs ?? 5000,
      poolPressureThreshold: config.poolPressureThreshold ?? 80,
      onLeakDetected: config.onLeakDetected ?? ((warning) => {
        console.warn(`[MongoSentinel:WARN] Potential connection leak detected! Connection #${warning.connectionId} checked out for ${warning.checkedOutDurationMs}ms (threshold: ${warning.thresholdMs}ms)`);
      }),
      onMetricsUpdate: config.onMetricsUpdate ?? (() => {}),
      debug: config.debug ?? true
    };
    this.attachListeners();
  }
  attachListeners() {
    this.client.on("connectionCreated", (event) => {
      this.metrics.totalCreated++;
      this.metrics.currentAvailable++;
      this.notifyUpdate();
      if (this.config.debug) {
        console.info(`[MongoSentinel:INFO] Connection created (id: ${event.connectionId}, pool size: ${this.metrics.currentAvailable})`);
      }
    });
    this.client.on("connectionClosed", (event) => {
      this.metrics.totalClosed++;
      if (this.metrics.currentAvailable > 0) {
        this.metrics.currentAvailable--;
      }
      this.notifyUpdate();
    });
    this.client.on("connectionCheckOutStarted", () => {
      this.metrics.checkoutWaitCount++;
      this.notifyUpdate();
    });
    this.client.on("connectionCheckedOut", (event) => {
      this.metrics.currentActive++;
      if (this.metrics.currentAvailable > 0) {
        this.metrics.currentAvailable--;
      }
      if (this.metrics.currentActive > this.metrics.peakActive) {
        this.metrics.peakActive = this.metrics.currentActive;
      }
      const connectionId = event.connectionId;
      const checkedOutAt = Date.now();
      const timer = setTimeout(() => {
        if (this.checkouts.has(connectionId)) {
          const duration = Date.now() - checkedOutAt;
          this.config.onLeakDetected({
            connectionId,
            checkedOutDurationMs: duration,
            thresholdMs: this.config.leakThresholdMs,
            timestamp: new Date
          });
        }
      }, this.config.leakThresholdMs);
      if (timer && typeof timer.unref === "function") {
        timer.unref();
      }
      this.checkouts.set(connectionId, {
        connectionId,
        checkedOutAt,
        timer
      });
      this.notifyUpdate();
    });
    this.client.on("connectionCheckedIn", (event) => {
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
    this.client.on("connectionPoolClosed", () => {
      this.destroy();
    });
  }
  getMetrics() {
    return { ...this.metrics };
  }
  getActiveCheckoutsCount() {
    return this.checkouts.size;
  }
  destroy() {
    for (const [, tracked] of this.checkouts) {
      clearTimeout(tracked.timer);
    }
    this.checkouts.clear();
  }
  notifyUpdate() {
    this.config.onMetricsUpdate(this.getMetrics());
  }
}
// src/safeClient.ts
import { MongoClient } from "mongodb";
var globalWithMongo = globalThis;
function getSafeMongoClient(uri, options = {}) {
  if (true) {
    if (!globalWithMongo._mongoSentinelClientPromise) {
      const client = new MongoClient(uri, {
        maxPoolSize: 10,
        minPoolSize: 1,
        maxIdleTimeMS: 30000,
        ...options.clientOptions
      });
      const sentinel = new MongoSentinel(client, options.sentinelConfig);
      globalWithMongo._mongoSentinelInstance = sentinel;
      globalWithMongo._mongoSentinelClientPromise = client.connect();
    }
    return {
      clientPromise: globalWithMongo._mongoSentinelClientPromise,
      sentinel: globalWithMongo._mongoSentinelInstance
    };
  }
  const client = new MongoClient(uri, {
    maxPoolSize: 20,
    minPoolSize: 2,
    maxIdleTimeMS: 60000,
    ...options.clientOptions
  });
  const sentinel = new MongoSentinel(client, options.sentinelConfig);
  const clientPromise = client.connect();
  return { clientPromise, sentinel };
}
export {
  MongoSentinel,
  getSafeMongoClient
};
