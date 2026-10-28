export interface StructuredLogPayload {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  meta?: Record<string, any>;
}

export class SentinelLogger {
  private jsonMode: boolean;

  constructor(jsonMode = false) {
    this.jsonMode = jsonMode;
  }

  public log(level: 'info' | 'warn' | 'error', message: string, meta?: Record<string, any>): void {
    if (this.jsonMode) {
      const payload: StructuredLogPayload = {
        level,
        message,
        timestamp: new Date().toISOString(),
        meta
      };
      console[level](JSON.stringify(payload));
    } else {
      console[level]('[MongoSentinel:' + level.toUpperCase() + '] ' + message, meta ?? '');
    }
  }
}
