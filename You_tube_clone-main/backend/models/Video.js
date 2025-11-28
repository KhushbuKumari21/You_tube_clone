import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String },

    category: { type: String, default: "Other" },
    tags: {
      type: [String],
      default: [],
    },

    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    uploadDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Video", VideoSchema);
