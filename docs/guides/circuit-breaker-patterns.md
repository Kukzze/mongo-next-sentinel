# Circuit Breaker Patterns & State Transitions

The Circuit Breaker pattern in `mongo-next-sentinel` safeguards application runtimes against cascading failures when upstream MongoDB replica sets or primary shards experience degradations.

## State Transition Machine

```
 [Closed]  ──(failure threshold exceeded)──>  [Open]
    ▲                                           │
    │                                     (reset timeout)
    │                                           │
    └──(consecutive successes)──  [Half-Open] <─┘
```

### State Behaviors

1. **Closed**: Normal operational mode. All database operations proceed with active telemetry and timeout tracking.
2. **Open**: Trip threshold exceeded (default: 5 consecutive failures or error rate > 50%). All operations fail immediately with `CircuitBreakerOpenException` to prevent saturating thread pools.
3. **Half-Open**: Trial probe mode. After the configured reset timeout (default: 10,000 ms), a controlled sample of requests is allowed through. If successful, the circuit resets to `Closed`. If failures persist, the circuit reverts to `Open`.

## Configuration Example

```typescript
import { createSentinel } from 'mongo-next-sentinel';

const sentinel = createSentinel({
  circuitBreaker: {
    failureThreshold: 5,
    resetTimeoutMs: 10000,
    halfOpenMaxRequests: 3,
  },
});
```
