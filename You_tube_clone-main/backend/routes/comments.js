// D:\youtube-clone\backend\routes\comments.js
import express from "express";
import {
  addComment,
  getComments,
  updateComment,
  deleteComment
} from "../controllers/commentController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Get comments for video
router.get("/:videoId", getComments);

// Add comment
router.post("/", verifyToken, addComment);

// Update comment
router.put("/:id", verifyToken, updateComment);

// Delete comment
router.delete("/:id", verifyToken, deleteComment);

export default router;
