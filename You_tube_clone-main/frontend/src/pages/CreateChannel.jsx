import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import "../styles/createChannel.css";

const CreateChannel = () => {
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  const handleCreate = async () => {
    if (!channelName || !description) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axiosInstance.post(
        "/channels",
        {
          channelName,
          description,
          channelBanner: "https://example.com/banners/default_banner.png",
          avatar: "https://example.com/avatars/default_avatar.png",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Backend se returned channel id
      const channelId = res.data.channel._id;

      // Navigate to channel page
      navigate(`/channel/${channelId}`);
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Failed to create channel");
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
