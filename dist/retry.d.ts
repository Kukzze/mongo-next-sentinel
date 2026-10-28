export interface RetryOptions {
    retries?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
}
export declare function withRetry<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T>;
//# sourceMappingURL=retry.d.ts.map