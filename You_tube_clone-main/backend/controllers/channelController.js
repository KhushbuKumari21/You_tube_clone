import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import User from "../models/User.js";

// ---------------------------
// CREATE CHANNEL
// ---------------------------
export const createChannel = async (req, res) => {
  const { channelName, description, channelBanner } = req.body;

  try {
    if (!channelName)
      return res.status(400).json({ message: "Channel name is required" });

    const existingChannel = await Channel.findOne({ channelName });
    if (existingChannel)
      return res.status(400).json({ message: "Channel name already exists" });

    const channel = await Channel.create({
      channelName,
      description,
      channelBanner,
      owner: req.user._id,
    });

    // Add channel to user
    await User.findByIdAndUpdate(req.user._id, {
      $push: { channels: channel._id },
    });

    res.status(201).json({
      message: "Channel created successfully",
      channel,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// GET CHANNEL BY ID
// ---------------------------
export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate("owner", "name username avatar")
      .populate("videos");

    if (!channel) return res.status(404).json({ message: "Channel not found" });

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// UPDATE CHANNEL
// ---------------------------
export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) return res.status(404).json({ message: "Channel not found" });

    // Only owner can update
    if (channel.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    channel.channelName = req.body.channelName || channel.channelName;
    channel.description = req.body.description || channel.description;
    channel.channelBanner = req.body.channelBanner || channel.channelBanner;

    await channel.save();

    res.json({
      message: "Channel updated successfully",
      channel,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------
// DELETE CHANNEL + VIDEOS
// ---------------------------
export const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) return res.status(404).json({ message: "Channel not found" });

    if (channel.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    // Delete all videos from this channel
    await Video.deleteMany({ channel: channel._id });

    // Remove channel
    await Channel.deleteOne({ _id: channel._id });

    // Remove channel from user
    await User.findByIdAndUpdate(channel.owner, {
      $pull: { channels: channel._id },
    });

    res.json({ message: "Channel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
