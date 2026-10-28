export type PoolEventType = 'connectionCreated' | 'connectionClosed' | 'connectionCheckedOut' | 'connectionCheckedIn' | 'connectionCheckOutStarted' | 'connectionCheckOutFailed';

export interface PoolEventCallback {
  (event: { type: PoolEventType; timestamp: number; meta?: any }): void;
}
