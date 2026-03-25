import mongoose from "mongoose";

// Local cache shape for connection reuse in development hot-reloads.
interface MongooseCache {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

// Declare augmentation on Node.js global to store cache safely.
declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Use your MongoDB URI from environment variables.
// In Next.js, server code should use MONGODB_URI (never client-exposed values).
const MONGODB_URI = process.env.MONGODB_URI as string | undefined;

if (!MONGODB_URI) {
  throw new Error("Invalid/Missing environment variable: MONGODB_URI");
}

const mongooseCache: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
if (!global.mongooseCache) {
  global.mongooseCache = mongooseCache;
}

/**
 * Establishes a singleton Mongoose connection.
 *
 * @returns the connected mongoose instance.
 */
export async function connectToDatabase(): Promise<mongoose.Mongoose> {
  // Reuse existing connection if already connected.
  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  // Use existing pending promise if one is in-flight.
  if (!mongooseCache.promise) {
    mongooseCache.promise = mongoose
      .connect(MONGODB_URI!, {
        // Recommended settings for Mongoose 7+ (some are defaults but explicit for clarity).
        dbName: process.env.MONGODB_DB || undefined,
        autoIndex: process.env.NODE_ENV === "development",
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  mongooseCache.conn = await mongooseCache.promise;
  return mongooseCache.conn;
}

/**
 * Closes the Mongoose connection - useful for testing or controlled shutdown.
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (!mongooseCache.conn) {
    return;
  }

  await mongoose.disconnect();
  mongooseCache.conn = null;
  mongooseCache.promise = null;
}

export {};  // Ensure this file is treated as a module for type augmentation.
