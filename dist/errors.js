"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreakerOpenError = exports.ConnectionLeakError = exports.SentinelError = void 0;
class SentinelError extends Error {
    constructor(message) {
        super('[MongoSentinel] ' + message);
        this.name = 'SentinelError';
    }
}
exports.SentinelError = SentinelError;
class ConnectionLeakError extends SentinelError {
    connectionId;
    durationMs;
    constructor(connectionId, durationMs) {
        super('Connection #' + connectionId + ' leaked after ' + durationMs + 'ms');
        this.connectionId = connectionId;
        this.durationMs = durationMs;
        this.name = 'ConnectionLeakError';
    }
}
exports.ConnectionLeakError = ConnectionLeakError;
class CircuitBreakerOpenError extends SentinelError {
    constructor() {
        super('Circuit breaker is OPEN. Connection checkouts temporarily rejected.');
        this.name = 'CircuitBreakerOpenError';
    }
}
exports.CircuitBreakerOpenError = CircuitBreakerOpenError;
//# sourceMappingURL=errors.js.map