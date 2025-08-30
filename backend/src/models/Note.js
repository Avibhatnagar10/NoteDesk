import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    lastEdited: { type: Date, default: Date.now },
  },
  { timestamps: true } // createdAt & updatedAt
);

// Update lastEdited on content change
noteSchema.pre("save", function (next) {
  this.lastEdited = new Date();
  next();
});

export default mongoose.model("Note", noteSchema);
