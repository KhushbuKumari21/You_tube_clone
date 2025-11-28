# YouTube Clone Backend

## Overview

This is a Node.js & Express backend for a YouTube clone application with:
JWT authentication
MongoDB data storage
APIs for users, Create channels, videos, like , dislike and comments.

## Features Implemented

### ✅ Authentication

- Sign up & Sign in endpoints (`/api/auth/signup`, `/api/auth/signin`)
- Password hashing with bcrypt
- JWT token generation for protected routes
- Removes password from API responses

### ✅ User Model

- Fields: `username`, `email`, `password`, `img`, `channels`
- Password hashing pre-save
- `matchPassword` method for authentication
- Relation to channels

### ✅ Channel Model

- Fields: `channelName` (unique), `description`, `channelBanner`, `owner`, `videos`
- Only owner can update/delete
- Channels linked to user
- Channel endpoints (`/api/channels`):
  - Create, read, update, delete
  - Protected routes via JWT

### ✅ Video Model

- Fields: `userId`, `title`, `desc`, `videoUrl`, `thumbnailUrl`, `views`, `likes`, `dislikes`
- Video endpoints (`/api/videos`):
  - CRUD operations
  - Increment views
  - Like/Dislike functionality
  - Protected routes for update/delete

### ✅ Comment Model

- Fields: `videoId`, `userId`, `text`
- Add, read, update, delete comments
- Protected routes for adding/updating/deleting comments
- Populate user info for frontend display

### ✅ JWT Integration

- Protected routes for:
  - Creating/updating/deleting channels
  - Adding/updating/deleting videos
  - Adding/updating/deleting comments
- `verifyToken` middleware implemented

# Backend File Structure

backend/
│── controllers/
│ ├── authController.js
│ ├── channelController.js
│ ├── commentController.js
│ └── videoController.js
│
│── middleware/
│ ├── verifyToken.js
│
│── models/
│ ├── User.js
│ ├── Channel.js
│ ├── Video.js
│ └── Comment.js
│
│── routes/
│ ├── auth.js
│ ├── channels.js
│ ├── comments.js
│ └── videos.js
│
│── utils/
│ └── generateToken.js
│
│── server.js
│── .env
│── package.json

---

## 2️⃣ How to setup Ptoject and Run Project

1.Open terminal in backend folder.
2.Install dependencies:

# npm install

3.Make sure # .env file exists with correct variables:
PORT=5000
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_secret_key

3️⃣ Run Backend
Start server with:

# npm start

You should see:

# Server running on port 5000

MongoDB connected: <your-db-host>

4️⃣ # Test API Endpoints (Thunder Client / Postman)

# Base URL: http://localhost:5000/api

# # YouTube Clone Backend Flow

1.User registers

2.User logs in → receives JWT token

3.Create a channel
Add JWT token in Authorization header
Send channel details in JSON body

4.Create/upload a video inside the channel
Add JWT token in Authorization header
Send video details in JSON body

5.Like a video
Add JWT token in header
Call the like endpoint

6.Dislike a video
Add JWT token in header
Call the dislike endpoint

7.Comment on a video
Add JWT token in header

comment text in JSON body

# OutPut Folder :

D:\youtube-clone\backend\backend output\OUTPUT

# Github Link :-https://github.com/KhushbuKumari21/You_tube_clone
