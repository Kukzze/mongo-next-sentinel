import { json } from '@remix-run/node';
import { getSafeMongoClient } from 'mongo-next-sentinel';

const client = getSafeMongoClient({ uri: process.env.MONGODB_URI! });

export const loader = async () => {
  const data = await client.db('test').collection('items').find().limit(5).toArray();
  return json({ data });
};
