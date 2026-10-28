export class SentinelError extends Error {
  constructor(message: string) {
    super('[MongoSentinel] ' + message);
    this.name = 'SentinelError';
  }
}

export class ConnectionLeakError extends SentinelError {
  constructor(public readonly connectionId: number | string, public readonly durationMs: number) {
    super('Connection #' + connectionId + ' leaked after ' + durationMs + 'ms');
    this.name = 'ConnectionLeakError';
  }
}

export class CircuitBreakerOpenError extends SentinelError {
  constructor() {
    super('Circuit breaker is OPEN. Connection checkouts temporarily rejected.');
    this.name = 'CircuitBreakerOpenError';
  }
}
