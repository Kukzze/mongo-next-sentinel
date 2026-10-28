import { getSafeMongoClient } from 'mongo-next-sentinel';

const client = getSafeMongoClient({ uri: 'mongodb://localhost:27017' });

Bun.serve({
  port: 3000,
  async fetch() {
    const ping = await client.db('admin').command({ ping: 1 });
    return Response.json(ping);
  }
});
