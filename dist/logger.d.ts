export interface StructuredLogPayload {
    level: 'info' | 'warn' | 'error';
    message: string;
    timestamp: string;
    meta?: Record<string, any>;
}
export declare class SentinelLogger {
    private jsonMode;
    constructor(jsonMode?: boolean);
    log(level: 'info' | 'warn' | 'error', message: string, meta?: Record<string, any>): void;
}
//# sourceMappingURL=logger.d.ts.map