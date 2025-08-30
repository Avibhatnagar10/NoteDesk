import express from "express";
import Note from "../models/Note.js";
import { authMiddleware } from "../middleware/auth.js";
import { redisClient } from "../server.js";

const router = express.Router();

// Create a note
router.post("/", authMiddleware, async (req, res) => {
  try {
    const note = new Note({ user: req.user.id, ...req.body });
    await note.save();

    // Invalidate cache for this user
    if (redisClient) await redisClient.del(`notes:${req.user.id}`);

    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get notes (with Redis cache)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cacheKey = `notes:${req.user.id}`;
    if (redisClient) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return res.json(JSON.parse(cached));
    }

    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });

    if (redisClient) await redisClient.set(cacheKey, JSON.stringify(notes), { EX: 60 }); // Cache 1 min
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
