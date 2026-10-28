# Mongoose Interoperability

Pass the underlying `mongoose.connection.getClient()` directly to `new MongoSentinel()` to monitor Mongoose pools.
