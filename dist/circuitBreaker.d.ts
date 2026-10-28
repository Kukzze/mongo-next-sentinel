export interface CircuitBreakerOptions {
    failureThreshold?: number;
    recoveryTimeoutMs?: number;
    onStateChange?: (state: 'OPEN' | 'HALF_OPEN' | 'CLOSED') => void;
}
export type CircuitState = 'OPEN' | 'HALF_OPEN' | 'CLOSED';
export declare class CircuitBreaker {
    private state;
    private failureCount;
    private lastFailureTime;
    private readonly failureThreshold;
    private readonly recoveryTimeoutMs;
    private readonly onStateChange?;
    constructor(options?: CircuitBreakerOptions);
    getState(): CircuitState;
    canExecute(): boolean;
    recordSuccess(): void;
    recordFailure(): void;
    private transitionTo;
}
//# sourceMappingURL=circuitBreaker.d.ts.map