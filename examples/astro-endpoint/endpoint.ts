import type { APIRoute } from 'astro';
import { getSafeMongoClient } from 'mongo-next-sentinel';

const client = getSafeMongoClient({ uri: process.env.MONGODB_URI! });

export const GET: APIRoute = async () => {
  const stats = await client.db('test').stats();
  return new Response(JSON.stringify(stats), { headers: { 'content-type': 'application/json' } });
};
