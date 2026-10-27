import { describe, test, expect, mock } from 'bun:test';
import { EventEmitter } from 'node:events';
import { MongoSentinel } from '../src/sentinel';

class MockMongoClient extends EventEmitter {
  public options = { maxPoolSize: 10 };
}

describe('MongoSentinel', () => {
  test('tracks connection creation and closures', () => {
    const client = new MockMongoClient() as any;
    const sentinel = new MongoSentinel(client);

    client.emit('connectionCreated', { connectionId: 1 });
    client.emit('connectionCreated', { connectionId: 2 });

    let metrics = sentinel.getMetrics();
    expect(metrics.totalCreated).toBe(2);
    expect(metrics.currentAvailable).toBe(2);

    client.emit('connectionClosed', { connectionId: 1 });
    metrics = sentinel.getMetrics();
    expect(metrics.totalClosed).toBe(1);
    expect(metrics.currentAvailable).toBe(1);
  });

  test('detects connection checkout and checkin', () => {
    const client = new MockMongoClient() as any;
    const sentinel = new MongoSentinel(client, { leakThresholdMs: 100 });

    client.emit('connectionCreated', { connectionId: 1 });
    client.emit('connectionCheckedOut', { connectionId: 1 });

    let metrics = sentinel.getMetrics();
    expect(metrics.currentActive).toBe(1);
    expect(metrics.peakActive).toBe(1);
    expect(sentinel.getActiveCheckoutsCount()).toBe(1);

    client.emit('connectionCheckedIn', { connectionId: 1 });
    metrics = sentinel.getMetrics();
    expect(metrics.currentActive).toBe(0);
    expect(sentinel.getActiveCheckoutsCount()).toBe(0);
  });

  test('fires onLeakDetected callback when checkout duration exceeds threshold', async () => {
    const client = new MockMongoClient() as any;
    const onLeak = mock();
    const sentinel = new MongoSentinel(client, {
      leakThresholdMs: 20,
      onLeakDetected: onLeak,
    });

    client.emit('connectionCreated', { connectionId: 99 });
    client.emit('connectionCheckedOut', { connectionId: 99 });

    await new Promise((resolve) => setTimeout(resolve, 35));

    expect(onLeak).toHaveBeenCalled();
    sentinel.destroy();
  });
});
