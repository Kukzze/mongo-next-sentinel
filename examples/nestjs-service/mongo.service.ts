import { getSafeMongoClient } from 'mongo-next-sentinel';

export class MongoService {
  private client = getSafeMongoClient({ uri: process.env.MONGODB_URI || 'mongodb://localhost:27017' });
  getClient() { return this.client; }
}
