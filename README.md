# 🤖 TalentAI — AI-Powered Job Portal

---

## 🌐 Live Demo

* 🔗 Frontend: https://talent-ai-gamma.vercel.app
* 🔗 Backend: https://talentai-ovvw.onrender.com

---

## 📌 Overview

TalentAI is a full-stack AI-powered job portal designed to streamline job searching and recruitment. It enables job seekers to discover opportunities and generate AI-assisted content, while recruiters can efficiently manage applications using intelligent insights powered by OpenAI.

---

## ✨ Key Features

### 🎯 For Job Seekers

* Browse & search jobs with filters (type, location, category, experience)
* 🤖 **AI Cover Letter Generator** (GPT-4o)
* 🤖 **AI Job Matching** based on user profile
* Apply with one click + resume upload
* Real-time application status tracking
* Save/bookmark jobs

---

### 🏢 For Recruiters

* Post jobs with AI-powered description improvement
* Manage applications in a single dashboard
* 📊 **AI Resume Scorer** (0–100% match)
* Update application statuses (Pending → Shortlisted → Interview → Offer)
* Real-time notifications to applicants

---

### 👑 For Admins

* Platform-wide analytics dashboard
* User management system

---

### 🔔 Real-time Notifications

* Built with Socket.io
* Instant alerts for applications and status updates

---

## 🛠️ Tech Stack

| Layer          | Technology                 |
| -------------- | -------------------------- |
| Frontend       | React 18, Vite, Zustand    |
| Styling        | Custom CSS (Design System) |
| Backend        | Node.js, Express.js        |
| Database       | MongoDB Atlas + Mongoose   |
| Authentication | JWT + bcryptjs             |
| AI             | OpenAI GPT-4o-mini         |
| Real-time      | Socket.io                  |
| File Upload    | Cloudinary + Multer        |

---

## 🔐 Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=your_openai_key
CLIENT_URL=http://localhost:5173
```

👉 See `.env.example` for reference.

---

## 🚀 Setup Instructions

### 1️⃣ Clone & Install

```bash
git clone https://github.com/your-username/TalentAI.git
cd TalentAI
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### 4️⃣ Run Application

Frontend will run at:

```
http://localhost:5173
```

---

## 📁 Project Structure

```
ai-job-portal/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
└── frontend/
    ├── components/
    ├── pages/
    ├── utils/
    └── App.jsx
```

---

## 🔑 Demo Accounts

| Role       | Email                                                             | Password |
| ---------- | ----------------------------------------------------------------- | -------- |
| Job Seeker | [demo.seeker@talentai.com](mailto:demo.seeker@talentai.com)       | demo123  |
| Recruiter  | [demo.recruiter@talentai.com](mailto:demo.recruiter@talentai.com) | demo123  |
| Admin      | [demo.admin@talentai.com](mailto:demo.admin@talentai.com)         | demo123  |

---

## 🌐 Deployment

### Backend (Render)

* Root: `backend`
* Build: `npm install`
* Start: `npm start`
* Add environment variables

### Frontend (Vercel)

* Root: `frontend`
* Add:

```
VITE_API_URL=https://talentai-ovvw.onrender.com
```

---

## 🧠 Highlights

* Real-world full-stack architecture
* AI-powered features using OpenAI
* Role-based authentication & dashboards
* Scalable and production-ready deployment

---

## 📬 Contact

Created by **Abhinav Rama**
GitHub: https://github.com/AbhinavS0201

---
