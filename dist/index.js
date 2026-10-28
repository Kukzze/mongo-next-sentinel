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
  getConfig() {
    return { ...this.config };
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
// src/circuitBreaker.ts
class CircuitBreaker {
  state = "CLOSED";
  failureCount = 0;
  lastFailureTime = 0;
  failureThreshold;
  recoveryTimeoutMs;
  onStateChange;
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold ?? 5;
    this.recoveryTimeoutMs = options.recoveryTimeoutMs ?? 30000;
    this.onStateChange = options.onStateChange;
  }
  getState() {
    if (this.state === "OPEN" && Date.now() - this.lastFailureTime > this.recoveryTimeoutMs) {
      this.transitionTo("HALF_OPEN");
    }
    return this.state;
  }
  canExecute() {
    const currentState = this.getState();
    return currentState === "CLOSED" || currentState === "HALF_OPEN";
  }
  recordSuccess() {
    if (this.state === "HALF_OPEN") {
      this.transitionTo("CLOSED");
    }
    this.failureCount = 0;
  }
  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.transitionTo("OPEN");
    }
  }
  transitionTo(newState) {
    if (this.state !== newState) {
      this.state = newState;
      this.onStateChange?.(newState);
    }
  }
}
// src/prometheus.ts
function formatPrometheusMetrics(metrics, prefix = "mongo_sentinel") {
  const lines = [
    "# HELP " + prefix + "_total_connections_created Total connections created in pool",
    "# TYPE " + prefix + "_total_connections_created counter",
    prefix + "_total_connections_created " + metrics.totalCreated,
    "# HELP " + prefix + "_total_connections_closed Total connections closed in pool",
    "# TYPE " + prefix + "_total_connections_closed counter",
    prefix + "_total_connections_closed " + metrics.totalClosed,
    "# HELP " + prefix + "_active_connections Current active in-flight checkouts",
    "# TYPE " + prefix + "_active_connections gauge",
    prefix + "_active_connections " + metrics.currentActive,
    "# HELP " + prefix + "_available_connections Current idle available connections",
    "# TYPE " + prefix + "_available_connections gauge",
    prefix + "_available_connections " + metrics.currentAvailable,
    "# HELP " + prefix + "_peak_active_connections Historical peak active connections",
    "# TYPE " + prefix + "_peak_active_connections gauge",
    prefix + "_peak_active_connections " + metrics.peakActive,
    "# HELP " + prefix + "_checkout_wait_count Total checkout requests queued",
    "# TYPE " + prefix + "_checkout_wait_count counter",
    prefix + "_checkout_wait_count " + metrics.checkoutWaitCount
  ];
  return lines.join(`
`) + `
`;
}
// src/health.ts
function evaluatePoolHealth(metrics, maxPoolSize = 100) {
  const total = metrics.currentActive + metrics.currentAvailable;
  const utilization = total > 0 ? metrics.currentActive / total * 100 : 0;
  let status = "HEALTHY";
  if (utilization > 90 || metrics.checkoutWaitCount > 50) {
    status = "CRITICAL";
  } else if (utilization > 70 || metrics.checkoutWaitCount > 10) {
    status = "DEGRADED";
  }
  return {
    status,
    utilizationPercent: Math.round(utilization),
    activeCount: metrics.currentActive,
    availableCount: metrics.currentAvailable
  };
}
// src/sanitizer.ts
function maskMongoUri(uri) {
  try {
    return uri.replace(/(:)([^@/]+)(@)/, "$1*****$3");
  } catch {
    return "[REDACTED_URI]";
  }
}
// src/retry.ts
async function withRetry(fn, options = {}) {
  const maxRetries = options.retries ?? 3;
  const baseDelay = options.baseDelayMs ?? 100;
  const maxDelay = options.maxDelayMs ?? 2000;
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries)
        throw err;
      const delay = Math.min(baseDelay * Math.pow(2, attempt) + Math.random() * 50, maxDelay);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}
// src/logger.ts
class SentinelLogger {
  jsonMode;
  constructor(jsonMode = false) {
    this.jsonMode = jsonMode;
  }
  log(level, message, meta) {
    if (this.jsonMode) {
      const payload = {
        level,
        message,
        timestamp: new Date().toISOString(),
        meta
      };
      console[level](JSON.stringify(payload));
    } else {
      console[level]("[MongoSentinel:" + level.toUpperCase() + "] " + message, meta ?? "");
    }
  }
}
// src/stats.ts
function calculatePercentile(samples, percentile) {
  if (samples.length === 0)
    return 0;
  const sorted = [...samples].sort((a, b) => a - b);
  const index = Math.ceil(percentile / 100 * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
}
// src/snapshot.ts
function createDiagnosticSnapshot(metrics, activeCount) {
  return {
    timestamp: new Date().toISOString(),
    version: "1.1.0",
    metrics: { ...metrics },
    activeCheckoutsCount: activeCount
  };
}
// src/validation.ts
function validateConnectionString(uri) {
  return uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://");
}
// src/edge.ts
function isEdgeRuntime() {
  return typeof globalThis.EdgeRuntime === "string";
}
function assertNodeOrEdge(environmentName = "MongoSentinel") {
  if (typeof process === "undefined" && !isEdgeRuntime()) {
    console.warn("[" + environmentName + ":WARN] Unsupported runtime detected; connection tracking may be degraded.");
  }
}
// src/constants.ts
var DEFAULT_LEAK_THRESHOLD_MS = 5000;
var DEFAULT_POOL_PRESSURE_THRESHOLD = 80;
var DEFAULT_MAX_POOL_SIZE = 100;
var SENTINEL_VERSION = "1.1.0";
// src/errors.ts
class SentinelError extends Error {
  constructor(message) {
    super("[MongoSentinel] " + message);
    this.name = "SentinelError";
  }
}

class ConnectionLeakError extends SentinelError {
  connectionId;
  durationMs;
  constructor(connectionId, durationMs) {
    super("Connection #" + connectionId + " leaked after " + durationMs + "ms");
    this.connectionId = connectionId;
    this.durationMs = durationMs;
    this.name = "ConnectionLeakError";
  }
}

class CircuitBreakerOpenError extends SentinelError {
  constructor() {
    super("Circuit breaker is OPEN. Connection checkouts temporarily rejected.");
    this.name = "CircuitBreakerOpenError";
  }
}
export {
  CircuitBreaker,
  CircuitBreakerOpenError,
  ConnectionLeakError,
  DEFAULT_LEAK_THRESHOLD_MS,
  DEFAULT_MAX_POOL_SIZE,
  DEFAULT_POOL_PRESSURE_THRESHOLD,
  MongoSentinel,
  SENTINEL_VERSION,
  SentinelError,
  SentinelLogger,
  assertNodeOrEdge,
  calculatePercentile,
  createDiagnosticSnapshot,
  evaluatePoolHealth,
  formatPrometheusMetrics,
  getSafeMongoClient,
  isEdgeRuntime,
  maskMongoUri,
  validateConnectionString,
  withRetry
};
