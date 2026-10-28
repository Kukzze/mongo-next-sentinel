# Optimizing Lambda Warm Starts

Declare your `MongoClient` outside the handler to reuse connection pools across lambda warm starts.
