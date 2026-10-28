# Vercel Serverless Functions Setup

```typescript
import { getSafeMongoClient } from 'mongo-next-sentinel';

export const dynamic = 'force-dynamic';
const client = getSafeMongoClient({ uri: process.env.MONGODB_URI! });
```
