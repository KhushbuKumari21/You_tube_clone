// D:\youtube-clone\backend\controllers\videoController.js

import Video from "../models/Video.js";
import Comment from "../models/Comment.js";

// ------------------------------
// GET ALL VIDEOS
// ------------------------------
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("channel", "channelName description channelBanner subscribers")
      .populate({
        path: "comments",
        populate: { path: "user", select: "username avatar" },
      })
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------------
// GET SINGLE VIDEO
// ------------------------------
export const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("channel", "channelName description channelBanner subscribers")
      .populate({
        path: "comments",
        populate: { path: "user", select: "username avatar" },
      });

    if (!video) return res.status(404).json({ message: "Video not found" });

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------------
// ADD NEW VIDEO
// ------------------------------
export const addVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, category, channel } =
      req.body;

    const newVideo = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      channel, // make sure channel is a valid ObjectId
    });

    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------------
// UPDATE VIDEO
// ------------------------------
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.channel.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    const { title, description, videoUrl, thumbnailUrl, category } = req.body;
    video.title = title || video.title;
    video.description = description || video.description;
    video.videoUrl = videoUrl || video.videoUrl;
    video.thumbnailUrl = thumbnailUrl || video.thumbnailUrl;
    video.category = category || video.category;

    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------------
// DELETE VIDEO
// ------------------------------
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.channel.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await video.remove();
    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------------
// INCREMENT VIEWS
// ------------------------------
export const incrementViews = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.views += 1;
    await video.save();

    res.json({ views: video.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------------
// LIKE VIDEO
// ------------------------------
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.likes += 1;
    await video.save();

    res.json({ likes: video.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------------
// DISLIKE VIDEO
// ------------------------------
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.dislikes += 1;
    await video.save();

    res.json({ dislikes: video.dislikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ------------------------------
// GET RANDOM VIDEOS
// ------------------------------
export const getRandomVideo = async (req, res) => {
  try {
    const count = await Video.countDocuments();
    if (count === 0) return res.status(200).json([]);

    const videos = await Video.aggregate([
      { $sample: { size: Math.min(10, count) } },
    ]);

    // Populate channel info safely
    const populatedVideos = await Promise.all(
      videos.map(async (v) => {
        const video = await Video.findById(v._id)
          .populate(
            "channel",
            "channelName description channelBanner subscribers"
          )
          .exec();
        return video;
      })
    );

    res.status(200).json(populatedVideos);
  } catch (error) {
    console.error("getRandomVideo error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ------------------------------
// GET VIDEOS BY TAGS
export const getVideosByTags = async (req, res) => {
  try {
    const tags = req.query.tags; // expected as comma-separated string: "react,js"
    if (!tags) return res.status(400).json({ message: "Tags are required" });

    const tagsArray = tags.split(",").map((tag) => tag.trim());

    const videos = await Video.find({ tags: { $in: tagsArray } })
      .select("title description videoUrl thumbnailUrl tags views likes dislikes")
      .populate("channel", "channelName avatar");

    res.status(200).json(videos);
  } catch (error) {
    console.error("getVideosByTags error:", error);
    res.status(500).json({ message: error.message });
  }
};
