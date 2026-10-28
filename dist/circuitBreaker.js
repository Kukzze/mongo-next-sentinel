"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = void 0;
class CircuitBreaker {
    state = 'CLOSED';
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
        if (this.state === 'OPEN' && Date.now() - this.lastFailureTime > this.recoveryTimeoutMs) {
            this.transitionTo('HALF_OPEN');
        }
        return this.state;
    }
    canExecute() {
        const currentState = this.getState();
        return currentState === 'CLOSED' || currentState === 'HALF_OPEN';
    }
    recordSuccess() {
        if (this.state === 'HALF_OPEN') {
            this.transitionTo('CLOSED');
        }
        this.failureCount = 0;
    }
    recordFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        if (this.failureCount >= this.failureThreshold) {
            this.transitionTo('OPEN');
        }
    }
    transitionTo(newState) {
        if (this.state !== newState) {
            this.state = newState;
            this.onStateChange?.(newState);
        }
    }
}
exports.CircuitBreaker = CircuitBreaker;
//# sourceMappingURL=circuitBreaker.js.map