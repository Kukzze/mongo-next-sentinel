import { getSafeMongoClient } from 'mongo-next-sentinel';

let client: any = null;

export const handler = async (event: any) => {
  if (!client) {
    client = getSafeMongoClient({ uri: process.env.MONGODB_URI! });
  }
  const result = await client.db('prod').collection('items').find().toArray();
  return { statusCode: 200, body: JSON.stringify(result) };
};
