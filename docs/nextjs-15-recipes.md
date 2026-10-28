# Next.js 15 Server Actions with Mongo Next Sentinel

```typescript
import { getSafeMongoClient } from 'mongo-next-sentinel';

const client = getSafeMongoClient({
  uri: process.env.MONGODB_URI!,
  sentinelConfig: {
    leakThresholdMs: 3000,
  }
});

export async function getUserAction(userId: string) {
  'use server';
  const db = client.db('production');
  return await db.collection('users').findOne({ _id: userId });
}
```
