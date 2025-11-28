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

  // Fetch channel data
  const fetchChannel = async () => {
    try {
      const res = await axiosInstance.get(`/channels/${id}`);
      setChannel(res.data);
      setSubscribers(res.data.subscribers || 0);
      setLoading(false);

      // Redirect to upload if no videos
      if (res.data.owner._id === localStorage.getItem("userId") && res.data.videos.length === 0) {
        navigate(`/upload-video/${res.data._id}`);
      }
    } catch (err) {
      setLoading(false);
      alert("Failed to load channel");
    }
  };

  useEffect(() => {
    fetchChannel();
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (!channel) return <h2>Channel Not Found</h2>;

  const handleSubscribe = () => {
    if (subscribed) return;
    setSubscribers(subscribers + 1);
    setSubscribed(true);
  };

  return (
    <div className="channel-page">
      <img className="channel-banner" src={channel.channelBanner} alt="" />

      <div className="channel-header">
        <div className="channel-header-left">
          <img src="/avatars/kkimage.png" className="channel-avatar" />
          <div className="channel-info-text">
            <h1 className="channel-title">{channel.channelName}</h1>
            <p className="channel-description">{channel.description}</p>
            <span className="sub-count">Subscribers: {subscribers}</span>
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

      <h2 className="video-section-title">Videos</h2>

      <div className="video-list">
        {channel.videos.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : (
          channel.videos.map((video) => (
            <div className="video-card" key={video._id}>
              <img src={video.thumbnail} alt={video.title} />
              <h4>{video.title}</h4>
              <p>{video.views} views • {new Date(video.uploadDate).toDateString()}</p>
              {channel.owner._id === localStorage.getItem("userId") && (
                <div className="video-actions">
                  <Link to={`/edit-video/${video._id}`}>
                    <button>Edit</button>
                  </Link>
                  <button
                    onClick={async () => {
                      await axiosInstance.delete(`/videos/${video._id}`);
                      fetchChannel();
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
