import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';

import authRoutes from './routes/auth.js';
// import userRoutes from './routes/users.js';
import { socketAuth } from './middleware/auth.js';
import { verifyJwt } from './middleware/auth.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// create http server
const server = http.createServer(app);

// initialize socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// socket auth middleware
io.use(socketAuth);

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  // clean up on disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.get('/dashboard/:workspaceId/:uuid', verifyJwt, (req, res) => {
  res.send(`Welcome to your dashboard, user ${req.user.username} for workspace ${req.params.workspaceId} and user ${req.params.uuid}`);
});
app.get('/profile', verifyJwt, (req, res) => {
  res.send(`This is your profile, user ${req.user.email} for workspace ${req.params.workspaceId} and user ${req.params.uuid}`);
});
app.get('/notes', verifyJwt, (req, res) => {
  res.send(`Here are your notes, user ${req.user.email}`);
});
// get notes for a specific workspace and user
app.get('/notes/:workspaceId/:uuid', verifyJwt, (req, res) => {
  res.send(`Here are your notes, user ${req.user.email} for workspace ${req.params.workspaceId} and user ${req.params.uuid}`);
});


let redisClient;

// function to start everything
async function startServer() {
  try {
    // MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Redis
    if (process.env.REDIS_URL) {
  redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.on("error", (err) => console.error("Redis Client Error", err));

  try {
    await redisClient.connect();
    console.log("✅ Connected to Redis");
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
  }
} else {
  console.log("⚠️ Redis not configured, skipping connection...");
}

    // Start HTTP + Socket.io server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

startServer();

export { io, redisClient };
