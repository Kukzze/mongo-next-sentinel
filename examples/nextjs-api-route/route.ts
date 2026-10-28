import { NextResponse } from 'next/server';
import { getSafeMongoClient } from 'mongo-next-sentinel';

const client = getSafeMongoClient({ uri: process.env.MONGODB_URI || 'mongodb://localhost:27017' });

export async function GET() {
  const users = await client.db('app').collection('users').find({}).limit(10).toArray();
  return NextResponse.json({ users });
}
