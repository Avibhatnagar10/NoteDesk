// models/Workspace.js
import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";

const workspaceSchema = new mongoose.Schema({
  uuid: { type: String, default: () => uuidv4(), unique: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, default: "My Workspace" },
  plan: { type: String, default: "free" },
  createdAt: { type: Date, default: Date.now },
  slug:{type:String, required:true, unique:true,default:()=>uuidv4()},
});

export default mongoose.models.Workspace || mongoose.model("Workspace", workspaceSchema);

