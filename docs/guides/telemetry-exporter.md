# OpenTelemetry & Prometheus Metrics Export Guide

`mongo-next-sentinel` exports high-fidelity connection pool metrics and circuit breaker events that integrate seamlessly with Prometheus, OpenTelemetry, and modern observability stacks.

## Prometheus Metrics Export

Enable Prometheus metrics in your Sentinel configuration:

```typescript
import { createSentinel } from 'mongo-next-sentinel';

const sentinel = createSentinel({
  prometheus: {
    enabled: true,
    prefix: 'mongo_sentinel_',
  },
});
```

### Exported Metrics

| Metric Name | Type | Description |
|---|---|---|
| `mongo_sentinel_pool_size` | Gauge | Total connections currently managed in the pool |
| `mongo_sentinel_pool_available` | Gauge | Available idle connections ready for checkout |
| `mongo_sentinel_checkout_duration_seconds` | Histogram | Latency histogram for connection checkouts |
| `mongo_sentinel_circuit_breaker_state` | Gauge | Circuit breaker state: 0 (Closed), 1 (Half-Open), 2 (Open) |
| `mongo_sentinel_leaks_detected_total` | Counter | Cumulative number of unreturned connection checkouts flagged |

## OpenTelemetry Integration

When running in Next.js Server Actions or edge workers, wrap your tracer with Sentinel's CMAP event listeners:

```typescript
import { trace } from '@opentelemetry/api';
import { Sentinel } from 'mongo-next-sentinel';

const tracer = trace.getTracer('mongo-next-sentinel');

sentinel.on('connectionCheckoutStarted', (event) => {
  const span = tracer.startSpan('mongo.pool.checkout');
  span.setAttribute('mongo.pool.id', event.address);
  span.end();
});
```
