import mongoose from "mongoose";

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Please define MONGODB_URI in .env.local");
  return uri;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(getMongoUri()).catch((err) => {
      const msg = err?.message ?? String(err);
      if (msg.includes("querySrv") && msg.includes("ENOTFOUND")) {
        throw new Error(
          "MongoDB SRV lookup failed (DNS). Use the standard connection string instead of mongodb+srv://. See MONGODB_CONNECTION_FIX.md in the project root."
        );
      }
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
