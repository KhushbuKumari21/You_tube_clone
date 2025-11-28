import express from "express";
import Video from "../models/Video.js";
import Comment from "../models/Comment.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* =========================================================
   CREATE VIDEO
========================================================= */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, channelId, tags } =
      req.body;

    if (!title || !videoUrl || !channelId) {
      return res
        .status(400)
        .json({ message: "title, videoUrl and channelId are required" });
    }

    const newVideo = await Video.create({
      uploader: req.user.id,
      channelId,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      tags: tags || [],
      views: 0,
      likes: [],
      dislikes: [],
      comments: [],
      uploadDate: new Date(),
    });

    res.status(201).json(newVideo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating video" });
  }
});

/* =========================================================
   GET ALL VIDEOS
========================================================= */
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().populate(
      "channelId",
      "channelName channelBanner"
    );

    const videosWithChannel = videos.map((v) => ({
      ...v._doc,
      channel: v.channelId,
    }));

    res.status(200).json(videosWithChannel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching videos" });
  }
});

/* =========================================================
   SEARCH VIDEOS — MUST BE ABOVE /find/:id
========================================================= */
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ message: "Search query missing" });
    }

    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).populate("channelId", "channelName channelBanner");

    const videosWithChannel = videos.map((v) => ({
      ...v._doc,
      channel: v.channelId,
    }));

    res.json(videosWithChannel);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server search error" });
  }
});

/* =========================================================
   GET VIDEOS BY TAG
========================================================= */
router.get("/tag/:tag", async (req, res) => {
  try {
    const tag = req.params.tag;

    const videos = await Video.find({
      tags: { $in: [tag] },
    }).populate("channelId", "channelName channelBanner");

    const videosWithChannel = videos.map((v) => ({
      ...v._doc,
      channel: v.channelId,
    }));

    res.status(200).json(videosWithChannel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching videos by tag" });
  }
});

/* =========================================================
   GET VIDEO BY ID
========================================================= */
router.get("/find/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate(
      "channelId",
      "channelName channelBanner"
    );
    if (!video) return res.status(404).json({ message: "Video not found" });

    const videoWithChannel = {
      ...video._doc,
      channel: video.channelId,
    };

    res.status(200).json(videoWithChannel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching video" });
  }
});

/* =========================================================
   LIKE VIDEO
========================================================= */
router.put("/like/:id", verifyToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user.id;

    if (!video.likes.includes(userId)) {
      video.likes.push(userId);
      video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);
    } else {
      video.likes = video.likes.filter((id) => id.toString() !== userId);
    }

    await video.save();
    res.status(200).json({ message: "Like updated", video });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error liking video" });
  }
});

/* =========================================================
   DISLIKE VIDEO
========================================================= */
router.put("/dislike/:id", verifyToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user.id;

    if (!video.dislikes.includes(userId)) {
      video.dislikes.push(userId);
      video.likes = video.likes.filter((id) => id.toString() !== userId);
    } else {
      video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);
    }

    await video.save();
    res.status(200).json({ message: "Dislike updated", video });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error disliking video" });
  }
});

/* =========================================================
   INCREMENT VIEWS
========================================================= */
router.put("/views/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.views += 1;
    await video.save();

    res.status(200).json({ views: video.views });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error incrementing views" });
  }
});

/* =========================================================
   ADD COMMENT
========================================================= */
router.put("/:id/comment", verifyToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const { text } = req.body;
    if (!text)
      return res.status(400).json({ message: "Comment text required" });

    const newComment = await Comment.create({
      text,
      video: video._id,
      user: req.user.id,
    });

    video.comments.push(newComment._id);
    await video.save();

    const populatedComment = await Comment.findById(newComment._id).populate(
      "user",
      "username img"
    );

    res.status(201).json(populatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding comment" });
  }
});

export default router;
