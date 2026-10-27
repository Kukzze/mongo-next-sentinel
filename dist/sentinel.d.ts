import type { MongoClient } from 'mongodb';
import type { SentinelConfig, PoolMetrics } from './types';
export declare class MongoSentinel {
    private client;
    private config;
    private checkouts;
    private metrics;
    constructor(client: MongoClient, config?: SentinelConfig);
    private attachListeners;
    getMetrics(): Readonly<PoolMetrics>;
    getActiveCheckoutsCount(): number;
    destroy(): void;
    private notifyUpdate;
}
//# sourceMappingURL=sentinel.d.ts.map