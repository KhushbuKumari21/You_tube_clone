// D:\youtube-clone\backend\controllers\commentController.js
import mongoose from "mongoose";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

/**
 * ---------------------------------------------------------
 * ADD COMMENT
 * ---------------------------------------------------------
 */
export const addComment = async (req, res) => {
  try {
    const { text, video } = req.body;

    if (!text || !video) {
      return res.status(400).json({ message: "Text and video are required" });
    }

    const newComment = await Comment.create({
      text,
      video,
      user: req.user._id,
    });

    // Store comment in video document
    await Video.findByIdAndUpdate(video, {
      $push: { comments: newComment._id },
    });

    // Populate user details
    const populated = await Comment.findById(newComment._id).populate(
      "user",
      "username img"
    );

    res.status(201).json(populated);
  } catch (err) {
    console.error("Add Comment Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * ---------------------------------------------------------
 * GET COMMENTS
 * ---------------------------------------------------------
 */
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId })
      .populate("user", "username img")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error("Get Comments Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * ---------------------------------------------------------
 * UPDATE COMMENT
 * ---------------------------------------------------------
 */
export const updateComment = async (req, res) => {
  try {
    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Ensure user is owner
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can update only your comment" });
    }

    comment.text = req.body.text || comment.text;
    await comment.save();

    res.status(200).json(comment);
  } catch (err) {
    console.error("Update Comment Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * ---------------------------------------------------------
 * DELETE COMMENT
 */
export const deleteComment = async (req, res) => {
  try {
    console.log("Delete request received for ID:", req.params.id);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can delete only your comment" });
    }

    // Delete comment
    await Comment.findByIdAndDelete(req.params.id);
    console.log("Comment deleted from collection");

    // Remove comment from video
    if (comment.video && mongoose.Types.ObjectId.isValid(comment.video)) {
      await Video.findByIdAndUpdate(comment.video, {
        $pull: { comments: comment._id },
      });
      console.log("Comment removed from video");
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Delete Comment Error:", err);
    res.status(500).json({ message: err.message });
  }
};
