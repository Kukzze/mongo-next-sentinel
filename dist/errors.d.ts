export declare class SentinelError extends Error {
    constructor(message: string);
}
export declare class ConnectionLeakError extends SentinelError {
    readonly connectionId: number | string;
    readonly durationMs: number;
    constructor(connectionId: number | string, durationMs: number);
}
export declare class CircuitBreakerOpenError extends SentinelError {
    constructor();
}
//# sourceMappingURL=errors.d.ts.map