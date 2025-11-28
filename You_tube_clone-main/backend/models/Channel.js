import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema(
  {
    channelName: { type: String, required: true, unique: true },
    description: { type: String },
    channelBanner: { type: String }, // optional banner image
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // owner reference
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }], // associated videos
  },
  { timestamps: true }
);

export default mongoose.model("Channel", ChannelSchema);
