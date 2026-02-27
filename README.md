# 🎨 Thumblify — AI Thumbnail Generator

Thumblify is a full-stack web application that generates stunning YouTube thumbnails using AI. Just enter your video title, choose a style and color scheme, and let the AI do the rest!

---

## 🚀 Features

- 🤖 AI-powered thumbnail generation using Hugging Face (Stable Diffusion XL)
- 🎨 Multiple styles — Bold & Graphic, Tech/Futuristic, Minimalist, Photorealistic, Illustrated
- 🌈 8 color scheme options — Vibrant, Sunset, Neon, Ocean, Pastel, and more
- 📐 Aspect ratio selector (16:9, 9:16, 1:1)
- 🔐 User authentication with session-based login/register
- ☁️ Automatic image upload to Cloudinary
- 📁 View and manage your previously generated thumbnails

---

## 🛠️ Tech Stack

### Frontend
- **React** (with TypeScript)
- **Vite** — fast dev build tool
- **Prebuilt UI Template** — for base layout and design components
- **Axios** — for API calls
- **React Router** — for page navigation
- **React Hot Toast** — for notifications

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **MongoDB Atlas** — cloud database
- **Mongoose** — ODM for MongoDB
- **Express Session** + **connect-mongo** — session-based authentication
- **Bcrypt** — password hashing
- **Cloudinary** — image storage
- **Hugging Face Inference API** — AI image generation (Stable Diffusion XL)

---

## 📁 Project Structure

```
Thumblify/
├── client/
│   └── reactjs/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── sections/
│       │   ├── context/
│       │   ├── configs/
│       │   └── data/
│       └── package.json
└── server/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middlewares/
    ├── configs/
    ├── server.ts
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Hugging Face account (free API token)
- Cloudinary account (free tier)

---

### 1. Clone the repository

```bash
git clone https://github.com/Shivam954629
cd AI-Thumbnail-generator
```

---

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```env
SESSION_SECRET=your_session_secret
MONGODB_URI=your_mongodb_atlas_uri
HF_TOKEN=your_huggingface_token
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

Start the server:

```bash
npm run server
```

Server will run at `http://localhost:3000`

---

### 3. Setup the Frontend

```bash
cd client/reactjs
npm install
npm run dev
```

Frontend will run at `http://localhost:5173`

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `SESSION_SECRET` | Secret key for express-session |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `HF_TOKEN` | Hugging Face API token |
| `CLOUDINARY_URL` | Cloudinary connection URL |

---

## 📸 How It Works

1. User registers or logs in
2. Enter a YouTube video title
3. Select style, aspect ratio, and color scheme
4. Click **Generate Thumbnail**
5. Thumblify builds a detailed prompt and sends it to Hugging Face's Stable Diffusion XL model
6. The generated image is uploaded to Cloudinary
7. The thumbnail is saved to MongoDB and displayed to the user

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/verify` | Verify current session |
| POST | `/api/thumbnail/generate` | Generate a new thumbnail |
| DELETE | `/api/thumbnail/delete/:id` | Delete a thumbnail |
| GET | `/api/user/thumbnail/:id` | Get a specific thumbnail |

---

## 🙌 Acknowledgements

- [Hugging Face](https://huggingface.co) — for the free Stable Diffusion XL API
- [Cloudinary](https://cloudinary.com) — for free image hosting
- [MongoDB Atlas](https://www.mongodb.com/atlas) — for free cloud database
- Prebuilt UI Template — for the base frontend design

---

## 📄 License

This project is licensed under the MIT License.