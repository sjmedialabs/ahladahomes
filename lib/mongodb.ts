import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://bnrhomes_db_user:Bnr123@bnrhomes.pg7pjqw.mongodb.net/?appName=bnrhomes"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}
console.log("MONGODB_URI:", MONGODB_URI)
// ✅ Define cache type
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// ✅ Extend global to include the cache
declare global {
  // Using _mongooseCache to avoid conflicts with the mongoose module
  var _mongooseCache: MongooseCache | undefined
}

// ✅ Initialize cache
let cached: MongooseCache = global._mongooseCache || { conn: null, promise: null }

if (!global._mongooseCache) {
  global._mongooseCache = cached
}

/**
 * Connect to MongoDB
 */
async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn
}

export default connectDB
