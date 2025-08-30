import express from "express";
import mongoose from "mongoose";
import { createClient } from "redis";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";

dotenv.config();

const app = express();
app.use(express.json());

// Global Redis client
let redisClient;

// Start server and connect databases
async function startServer() {
  try {
    // --------- MongoDB Connection ---------
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not set in .env");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // --------- Redis Connection ---------
    if (!process.env.REDIS_HOST || !process.env.REDIS_PORT) 
      throw new Error("REDIS_HOST or REDIS_PORT not set in .env");

    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });

    redisClient.on("error", (err) => console.error("❌ Redis error:", err));
    await redisClient.connect();
    console.log("✅ Redis connected");

    // --------- Register Routes ---------
    // Make redisClient available in request object
    app.use((req, res, next) => {
      req.redisClient = redisClient;
      next();
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/notes", notesRoutes);

    // --------- Test Route ---------
    app.get("/", async (req, res) => {
      try {
        await redisClient.set("test", "Hello from Redis!");
        const value = await redisClient.get("test");
        res.send(`Server running with MongoDB + Redis 🚀 | Redis test: ${value}`);
      } catch (err) {
        res.status(500).send("Redis error: " + err.message);
      }
    });

    // --------- Start Express Server ---------
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1);
  }
}

// Initialize everything
startServer();

// Export redisClient for use in other modules if needed
export { redisClient };
