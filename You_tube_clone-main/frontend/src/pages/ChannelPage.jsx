import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import "../styles/channelPage.css";
import { FaBell, FaRegBell } from "react-icons/fa";

const ChannelPage = () => {
  const { id } = useParams(); // channel ID
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  const fetchChannel = async () => {
    try {
      const res = await axiosInstance.get(`/channels/${id}`);
      setChannel(res.data);
      setSubscribers(res.data.subscribers || 0);
      setLoading(false);

      // Redirect owner to upload if no videos
      if (
        res.data.owner._id === localStorage.getItem("userId") &&
        res.data.videos.length === 0
      ) {
        navigate(`/upload-video/${res.data._id}`);
      }
    } catch (err) {
      console.log(err.response?.data);
      setLoading(false);
      alert(err.response?.data?.message || "Failed to load channel");
    }
  };

  useEffect(() => {
    fetchChannel();
  }, [id]);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  if (!channel) return <h2 style={{ textAlign: "center" }}>Channel Not Found</h2>;

  const handleSubscribe = async () => {
  if (subscribed) return;
  setSubscribers(subscribers + 1); // frontend
  setSubscribed(true);
  const token = localStorage.getItem("token");
  try {
    await axiosInstance.post(`/channels/${id}/subscribe`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.log(err.response?.data);
  }
};

  return (
    <div className="channel-page">
      <img
        className="channel-banner"
        src={channel.channelBanner || "/avatars/kkimage.png"}
        alt="Channel Banner"
      />

      <div className="channel-header">
        <div className="channel-header-left">
          <img
            src={channel.avatar || "/avatars/kkimage.png"}
            className="channel-avatar"
            alt="Avatar"
          />
          <div className="channel-info-text">
            <h1>{channel.channelName}</h1>
            <p>{channel.description}</p>
            <span>Subscribers: {subscribers}</span>
          </div>
        </div>

        <div className="channel-header-right">
          <button className="subscribe-btn" onClick={handleSubscribe}>
            {subscribed ? <FaBell /> : <FaRegBell />} Subscribe
          </button>

          {channel.owner._id === localStorage.getItem("userId") && (
            <Link to={`/upload-video/${channel._id}`}>
              <button className="upload-btn">Upload New Video</button>
            </Link>
          )}
        </div>
      </div>

      <h2>Videos</h2>
      <div className="video-list">
        {channel.videos.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : (
          channel.videos.map((video) => (
            <div key={video._id} className="video-card">
              <img src={video.thumbnail} alt={video.title} />
              <h4>{video.title}</h4>
              <p>
                {video.views} views • {new Date(video.uploadDate).toDateString()}
              </p>

              {channel.owner._id === localStorage.getItem("userId") && (
                <div className="video-actions">
                  <Link to={`/edit-video/${video._id}`}>
                    <button>Edit</button>
                  </Link>
                  <button
                    onClick={async () => {
                      if (window.confirm("Delete this video?")) {
                        const token = localStorage.getItem("token");
                        await axiosInstance.delete(`/videos/${video._id}`, {
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        fetchChannel();
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChannelPage;
