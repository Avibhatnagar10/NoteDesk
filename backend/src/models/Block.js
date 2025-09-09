// models/Page.js
import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";

const blockSchema = new mongoose.Schema({
    uuid: { type: String, default: () => uuidv4(), unique: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  export default mongoose.models.Block || mongoose.model("Block", blockSchema);

  