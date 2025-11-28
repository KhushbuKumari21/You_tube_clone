import mongoose from "mongoose";

// VideoSchema defines the structure of a Video document in MongoDB
const VideoSchema = new mongoose.Schema(
  {
    // Reference to the User who uploaded the video
    // This is needed to identify the owner/uploader of the video
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Reference to the Channel the video belongs to
    // Each video must be associated with a channel
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },

    // Title of the video
    // Required field for displaying video title in UI
    title: { type: String, required: true },

    // Description of the video
    // Optional, can provide more information about the video content
    description: { type: String, default: "" },

    // URL of the uploaded video
    // Required to play the video
    videoUrl: { type: String, required: true },

    // URL of the thumbnail image
    // Used to display a preview image for the video
    thumbnailUrl: { type: String },

    // Category of the video
    // Helps in filtering and organizing videos
    category: { type: String, default: "Other" },

    // Tags associated with the video
    // Useful for search, recommendations, and filtering
    tags: {
      type: [String],
      default: [],
    },

    // Number of views
    // Tracks video popularity
    views: { type: Number, default: 0 },

    // Array of User references who liked the video
    // Helps implement like/dislike functionality
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Array of User references who disliked the video
    // Helps implement dislike functionality
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Array of Comment references
    // Stores comments associated with the video
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],

    // Upload date of the video
    // Default to current date/time when video is created
    uploadDate: { type: Date, default: Date.now },
  },
  {
    // Adds createdAt and updatedAt timestamps automatically
    timestamps: true,
  }
);

// Export the Video model
export default mongoose.model("Video", VideoSchema);
