import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';

const router = express.Router();

// ----------------- SIGNUP -----------------
router.post('/signup', async (req, res) => {
  console.log("📩 Incoming body:", req.body);
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] }).populate('workspaceId');
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new User({ username, email,  passwordHash });
    await newUser.save();

    const workspace = await Workspace.create({
      ownerId: newUser._id,
      name: `${newUser.username}'s Workspace`,
    });
    newUser.workspaceId = workspace._id;
    await newUser.save();

    res.status(201).json({ message: 'User created successfully ✅' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----------------- LOGIN -----------------
router.post('/login', async (req, res) => {
  console.log("📩 Incoming body:", req.body);
  try {
    const { identifier, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] }).populate('workspaceId');
    if (!user) {
      return res.status(400).json({ message: 'Invalid username/email or password' });
    }

    // Compare password
    const isMatch =  await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid identifier/password' });
    }
  // 🔑 Ensure workspace exists (fallback if post-save didn’t finish yet)
  if (!user.workspaceId) {
    const workspace = await Workspace.create({  
      ownerId: user._id,
      name: `${user.username}'s Workspace`,
    });
    user.workspaceId = workspace._id;
    await user.save();
  }
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id,uuid:user.uuid, username: user.username, email: user.email, workspaceId: user.workspaceId },
        process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: "Login Successful 🎉",
      token,
      user: {
        uuid: user.uuid,
        username: user.username,
        userId: user._id,
        email: user.email,
        workspaceId: user.workspaceId?.slug || user.workspaceId?._id,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
