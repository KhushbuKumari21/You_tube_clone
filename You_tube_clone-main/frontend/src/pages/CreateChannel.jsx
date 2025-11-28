// src/pages/CreateChannel.jsx
import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import "../styles/createChannel.css";



const CreateChannel = () => {
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const res = await axiosInstance.post("/channels", {
        channelName,
        description,
        channelBanner:
          "https://example.com/banners/default_banner.png",
      });

      navigate(`/channel/${res.data.channel._id}`);
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="create-channel-page">
      <h2>Create Your Channel</h2>

      <input
        type="text"
        placeholder="Channel Name"
        onChange={(e) => setChannelName(e.target.value)}
      />

      <textarea
        placeholder="Channel Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleCreate}>Create Channel</button>
    </div>
  );
};

export default CreateChannel;
