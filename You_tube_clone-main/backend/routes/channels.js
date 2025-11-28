// D:\youtube-clone\backend\routes\channels.js
import express from "express";
import mongoose from "mongoose";
import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* --------------------------
   HELPER: Validate ObjectId
--------------------------- */
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/* --------------------------
   CREATE CHANNEL
--------------------------- */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    if (!channelName)
      return res.status(400).json({ message: "Channel name is required" });

    // Check already exists by OWNER
    const oldChannel = await Channel.findOne({ owner: req.user._id });
    if (oldChannel)
      return res.status(400).json({ message: "User already has a channel" });

    const newChannel = await Channel.create({
      channelName,
      description,
      channelBanner,
      owner: req.user._id,
    });

    // Add channel reference in user
    await User.findByIdAndUpdate(req.user._id, {
      $push: { channels: newChannel._id },
    });

    res.status(201).json({
      message: "Channel created successfully",
      channel: newChannel,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* --------------------------
    GET ALL CHANNELS
--------------------------- */
router.get("/", async (req, res) => {
  try {
    const channels = await Channel.find()
      .populate("owner", "username email img")
      .populate("videos");

    res.status(200).json(channels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* --------------------------
   GET CHANNEL BY CHANNEL ID
--------------------------- */
router.get("/:id", async (req, res) => {
  if (!isValidId(req.params.id))
    return res.status(400).json({ message: "Invalid channel ID" });

  try {
    const channel = await Channel.findById(req.params.id)
      .populate("owner", "username email img")
      .populate({
        path: "videos",
        populate: { path: "channel", select: "channelName channelBanner" },
      });

    if (!channel)
      return res.status(404).json({ message: "Channel not found" });

    res.status(200).json(channel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------------------------------------------
   GET CHANNEL BY USER ID  (Sidebar → Your Channel)
---------------------------------------------------- */
router.get("/find/:userId", async (req, res) => {
  if (!isValidId(req.params.userId))
    return res.status(400).json({ message: "Invalid User ID" });

  try {
    const channel = await Channel.findOne({ owner: req.params.userId })
      .populate("owner", "username email img")
      .populate("videos");

    if (!channel)
      return res.status(404).json({ message: "Channel not found" });

    res.status(200).json(channel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* --------------------------
    UPDATE CHANNEL
--------------------------- */
router.put("/:id", verifyToken, async (req, res) => {
  if (!isValidId(req.params.id))
    return res.status(400).json({ message: "Invalid channel ID" });

  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel)
      return res.status(404).json({ message: "Channel not found" });

    if (channel.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    channel.channelName = req.body.channelName || channel.channelName;
    channel.description = req.body.description || channel.description;
    channel.channelBanner = req.body.channelBanner || channel.channelBanner;

    await channel.save();

    res.status(200).json({ message: "Channel updated", channel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* --------------------------
    DELETE CHANNEL + VIDEOS
--------------------------- */
router.delete("/:id", verifyToken, async (req, res) => {
  if (!isValidId(req.params.id))
    return res.status(400).json({ message: "Invalid channel ID" });

  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel)
      return res.status(404).json({ message: "Channel not found" });

    if (channel.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    // Delete videos
    await Video.deleteMany({ channel: channel._id });

    // Delete channel
    await Channel.findByIdAndDelete(req.params.id);

    // Remove channel ref from user
    await User.findByIdAndUpdate(channel.owner, {
      $pull: { channels: channel._id },
    });

    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
