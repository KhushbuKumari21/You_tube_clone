# YouTube Clone - React Frontend

A YouTube-like video streaming web application built with **React.js (Vite)**.  
Users can watch videos, like/dislike, comment, search, filter, and manage their own channel videos (upload/edit/delete).

## Features

### Home Page

- YouTube-style header with logo, search bar, and user authentication status
- Toggleable sidebar via hamburger menu
- Filter buttons for video categories
- Grid display of video thumbnails showing:
  - Title
  - Thumbnail
  - Channel name
  - Views

### User Authentication

- Sign in / Register using username, email, and password
- After login, user name appears at the top

### Search and Filter

- Search bar in header filters videos by title
- Filter buttons for categories

### Video Player Page

- Embedded video player for uploaded or external videos
- Shows title, description, channel info
- Like and dislike buttons
- Comment section with add, edit, delete functionality

### Channel Page

- Users can create a channel after signing in
- View all videos for the channel
- Edit or delete owned videos

### Responsive Design

- Fully responsive for desktop, tablet, and mobile

✅ folder structure
frontend/
│── .env
│── index.html
│── package.json
│── vite.config.js (if exists)
│── public/
│ ├── avatars/
│ │ └── kkimage.png
│ ├── thumbnails/
│ │ ├── image.jpg
│ │ ├── motivational-whatsapp-thumbnail.png
│ │ ├── movie.jpg
│ │ └── Tech.jpg
│ └── videos/
│ ├── amita-banchan-motivational-status-video.mp4
│ ├── motivational-whatapp-status-video-3.mp4
│ ├── motivational-whatapp-status-video-4.mp4
│ └── motivational-whatsapp-video-status-1.mp4
│
└── src/
├── App.jsx
├── main.jsx
├── axiosInstance.js
├── firebase.js
│
├── assets/
│ ├── placeholder.png
│ └── channel-placeholder.png
│
├── components/
│ ├── Comment.jsx
│ ├── Comments.jsx
│ ├── Header.jsx
│ ├── LoadingComp.jsx
│ ├── ProtectedRoute.jsx
│ ├── Sidebar.jsx
│ ├── Tags.jsx
│ ├── TagVideos.jsx
│ ├── VideoCard.jsx
│
├── constants/
│ └── index.js
│
├── data/
│ ├── sampleChannel.js
│ ├── sampleUsers.js
│ └── sampleVideos.js
│
├── helper/
│ └── fetchComments.js
│
├── pages/
│ ├── Account.jsx
│ ├── ChannelPage.jsx
│ ├── CreateChannel.jsx
│ ├── HomePage.jsx
│ ├── LoginPage.jsx
│ ├── PageNotFound.jsx
│ ├── RegisterPage.jsx
│ ├── SearchPage.jsx
│ ├── UploadPage.jsx
│ └── VideoPage.jsx
│
├── redux/
│ ├── store.js
│ ├── userSlice.js
│ ├── videoSlice.js
│ └── videosSlice.js
│
└── styles/
├── account.css
├── App.css
├── auth.css
├── channelPage.css
├── comment.css
├── comments.css
├── createChannel.css
├── Header.css
├── home.css
├── loading.css
├── pageNotFound.css
├── search.css
├── sidebar.css
├── tags.css
├── tagVideos.css
├── uploadPage.css
├── video.css
└── VideoCard.css

## Tech Stack

**Frontend:**

- React.js
- Redux (state management)
- React Router DOM
- Axios for API calls
- React Player for video playback
- CSS for styling

---

## Installation and Run

1. Clone the repository:

```bash
git clone https://github.com/KhushbuKumari21/youtube-clone.git

2.cd youtube-clone/frontend

3.Install dependencies:
npm install

4.Setup .env file in frontend/:
VITE_API_URL=http://localhost:5000

5.Start the frontend server:
npm run dev

Open in browser: http://localhost:5173

✅ Working Flow of the YouTube Clone App
  1.User Registers
   A new user creates an account by entering name, email/username, and password.
  2.Account Gets Created
    After successful registration, the user record is stored in the database.
  3.User Logs In
  User logs in using email or username + password.
  A JWT token is generated and stored in the browser (localStorage).
  4.Home Page Loads
  User is redirected to the Home Page.
  All videos are displayed (latest uploaded videos).
 5.User Can Filter Videos
    There are two ways to find/filter videos:
       Tags Filter – Click on tags to see category-wise videos.
       Search Bar – Search videos by title or keywords.
 6.User Clicks Any Video
   Opens the Video Page.
    User can:👍 Like 👎 Dislike 💬 Comment(create ,Edit , delte)
    View channel info
    Check related videos

7.User Can Create a Channel
  Go to Create Channel page.
  Add channel name, description, and banner image.

8.User Uploads Videos
  Once the channel is created, the user can upload videos.
  Upload form includes:
      Video file
      Thumbnail
      Title
      Description
      Tags

Github Link :-https://github.com/KhushbuKumari21/You_tube_clone
```
