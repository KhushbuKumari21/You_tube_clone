import mongoose from "mongoose";

// Define the schema for a Comment
const CommentSchema = new mongoose.Schema(
  {
    // Reference to the associated video
    video: {
      type: mongoose.Schema.Types.ObjectId, // Stores ObjectId of a Video
      ref: "Video", // Refers to the Video model
      required: true, // A comment must belong to a video
    },
    // Reference to the user who made the comment
    user: { 
      type: mongoose.Schema.Types.ObjectId, // Stores ObjectId of a User
      ref: "User", // Refers to the User model
      required: true, // A comment must have an author
    },
    // Comment text content
    text: { 
      type: String, 
      required: true, // Comment text cannot be empty
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the Comment model
export default mongoose.model("Comment", CommentSchema);
