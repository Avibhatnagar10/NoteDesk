import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import Workspace from "./Workspace.js";
import Page from "./Page.js";
import Block from "./Block.js";

const userSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4(),
    },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
  },
  { timestamps: true }
);

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Auto-create workspace + default page + starter block after user is saved
userSchema.post("save", async function (doc, next) {
  try {
    // only run if user has no workspace yet
    if (!doc.workspaceId) {
      const workspace = await Workspace.create({
        ownerId: doc._id,
        name: `${doc.username}'s Workspace`,
      });

      await mongoose.model("User").findByIdAndUpdate(doc._id, {
        workspaceId: workspace._id,
      });

      const page = await Page.create({
        workspaceId: workspace._id,
        ownerId: doc._id,
        title: "Quick Notes",
      });

      await Block.create({
        pageId: page._id,
        type: "text",
        content: { text: "Welcome to your workspace 👋" },
        order: 1,
      });
    }
    next();
  } catch (err) {
    console.error("Error bootstrapping workspace:", err);
    next(err);
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
