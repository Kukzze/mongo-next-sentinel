import express from 'express';
import { getSafeMongoClient } from 'mongo-next-sentinel';

const app = express();
const client = getSafeMongoClient({ uri: process.env.MONGODB_URI || 'mongodb://localhost:27017' });

app.get('/health', async (req, res) => {
  const ping = await client.db('admin').command({ ping: 1 });
  res.json({ status: 'ok', ping });
});

export default app;
