import mongoose from "mongoose";
import { createClient } from "redis";

export const connectMongo = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB error", err);
    process.exit(1);
  }
};

export const connectRedis = async (url) => {
  const client = createClient({ url });
  client.on("error", (err) => console.error("❌ Redis error:", err));
  await client.connect();
  console.log("✅ Redis connected");
  return client;
};
