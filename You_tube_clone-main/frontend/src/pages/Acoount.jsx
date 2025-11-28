// src/pages/AccountPage.jsx
import React, { useState, useEffect } from "react";
import "../styles/account.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import axiosInstance from "../axiosInstance";

const AccountPage = ({ currentUser }) => {
  const [inputs, setInputs] = useState({
    name: currentUser?.name || "",
    username: currentUser?.username || "",
  });
  const [profileImg, setProfileImg] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Upload profile image to Firebase
  useEffect(() => {
    if (!profileImg) return;
    const storage = getStorage(app);
    const fileName = Date.now() + "-" + profileImg.name;
    const storageRef = ref(storage, "profileImages/" + fileName);

    const uploadTask = uploadBytesResumable(storageRef, profileImg);
    uploadTask.on(
      "state_changed",
      (snapshot) =>
        setUploadProgress(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        ),
      (err) => console.log(err),
      () =>
        getDownloadURL(uploadTask.snapshot.ref).then((url) =>
          setInputs((prev) => ({ ...prev, img: url }))
        )
    );
  }, [profileImg]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.put(`/users/${currentUser._id}`, inputs, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (!currentUser) return <h2>No user found</h2>;

  return (
    <div className="account-container">
      <div className="account-header">
        <img className="account-avatar" src={currentUser.img} alt="User" />
        <h2>{currentUser.name}</h2>
        <p>{currentUser.email}</p>
      </div>

      <div className="account-form">
        <label>Name</label>
        <input
          name="name"
          value={inputs.name}
          onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
        />

        <label>Username</label>
        <input
          name="username"
          value={inputs.username}
          onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
        />

        <label>Email (Not Editable)</label>
        <input value={currentUser.email} disabled />

        <label>Profile Picture</label>
        {uploadProgress > 0 && uploadProgress < 100 ? (
          <p>Uploading: {uploadProgress}%</p>
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImg(e.target.files[0])}
          />
        )}

        <button className="save-btn" onClick={handleUpdate}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
