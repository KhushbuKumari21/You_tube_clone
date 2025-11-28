// Importing required modules and hooks
import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance"; // Pre-configured Axios instance
import { useNavigate } from "react-router-dom"; // For page navigation
import "../styles/createChannel.css"; // Styles

const CreateChannel = () => {
  // Local state for form inputs
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Redirect user to login page if token does not exist
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  // Handle channel creation request
  const handleCreate = async () => {
    // Validate fields
    if (!channelName || !description) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // API call to create a new channel
      const res = await axiosInstance.post(
        "/channels",
        {
          channelName,
          description,
          // Default banner and avatar (you can replace later)
          channelBanner: "https://example.com/banners/default_banner.png",
          avatar: "https://example.com/avatars/default_avatar.png",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Extracting channel ID from backend response
      const channelId = res.data.channel._id;

      // Redirecting to the newly created channel's page
      navigate(`/channel/${channelId}`);
    } catch (err) {
      // Error logging and message
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Failed to create channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-channel-page">
      <h2>Create Your Channel</h2>

      {/* Channel Name Input */}
      <input
        type="text"
        placeholder="Channel Name"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
      />

      {/* Channel Description Input */}
      <textarea
        placeholder="Channel Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Create Button */}
      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Creating..." : "Create Channel"}
      </button>
    </div>
  );
};

export default CreateChannel;
