// src/pages/CreateChannel.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import "../styles/createChannel.css";

const CreateChannel = () => {
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect non-logged-in users
  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      navigate("/login"); // redirect to login
    }
  }, [navigate]);

  const handleCreate = async () => {
    if (!channelName.trim() || !description.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/channels", {
        channelName,
        description,
        channelBanner: "https://example.com/banners/default_banner.png", // default banner
        avatar: "https://example.com/avatars/default_avatar.png", // default avatar
      });

      navigate(`/channel/${res.data.channel._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create channel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-channel-page">
      <h2>Create Your Channel</h2>

      <input
        type="text"
        placeholder="Channel Name"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
      />

      <textarea
        placeholder="Channel Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Creating..." : "Create Channel"}
      </button>
    </div>
  );
};

export default CreateChannel;
