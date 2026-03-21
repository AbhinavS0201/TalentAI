# 🤖 TalentAI — AI-Powered Job Portal

> A full-stack MERN application with AI features built for the Unified Internship Program

![TalentAI](https://img.shields.io/badge/MERN-Stack-61DAFB?style=for-the-badge&logo=react)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=for-the-badge&logo=openai)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?style=for-the-badge&logo=socket.io)

---

## ✨ Key Features

### 🎯 For Job Seekers
- Browse & search jobs with filters (type, location, category, experience)
- **AI Cover Letter Generator** — Generates personalized cover letters using GPT-4o
- **AI Job Matching** — AI suggests jobs that match your profile
- Apply with one click + resume upload
- Real-time application status tracking
- Save/bookmark jobs

### 🏢 For Recruiters
- Post jobs with AI-powered description improvement
- Manage all applications in one dashboard
- **AI Resume Scorer** — Automatically score candidate matches (0-100%)
- Update application statuses (Pending → Shortlisted → Interview → Offer)
- Real-time notifications to applicants on status change

### 👑 For Admins
- Platform-wide analytics dashboard
- User management (view all users, roles)

### 🔔 Real-time Notifications (Socket.io)
- Recruiters notified instantly on new applications
- Job seekers notified on status changes

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Zustand, Vite |
| Styling | Custom CSS with design system (CSS Variables) |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| AI | OpenAI GPT-4o-mini |
| Real-time | Socket.io |
| File Upload | Cloudinary + Multer |
| Notifications | React Hot Toast |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- Cloudinary account (free)
- OpenAI API key

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Fill in your .env values

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ai-job-portal
JWT_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=sk-your-openai-key
CLIENT_URL=http://localhost:5173
```

### 3. Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open: **http://localhost:5173**

---

## 📁 Project Structure

```
ai-job-portal/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cloudinary.js      # Cloudinary setup
│   ├── controllers/
│   │   ├── authController.js  # Register, Login, Profile
│   │   ├── jobController.js   # CRUD Jobs
│   │   ├── applicationController.js
│   │   ├── aiController.js    # OpenAI integrations
│   │   ├── notificationController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js            # JWT + Role middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── applications.js
│   │   ├── ai.js
│   │   ├── users.js
│   │   └── notifications.js
│   └── server.js              # Express + Socket.io
│
└── frontend/
    └── src/
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.jsx  # Responsive navbar with notifications
        │   │   └── Navbar.css
        │   └── jobs/
        │       ├── JobCard.jsx # Reusable job card
        │       └── JobCard.css
        ├── context/
        │   └── authStore.js   # Zustand global auth store
        ├── pages/
        │   ├── HomePage.jsx           # Landing with hero + search
        │   ├── JobsPage.jsx           # Jobs listing + filters
        │   ├── JobDetailPage.jsx      # Job detail + AI cover letter
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── JobSeekerDashboard.jsx # Application tracker + AI matches
        │   ├── RecruiterDashboard.jsx # Job manager + AI scoring
        │   ├── AdminDashboard.jsx
        │   ├── PostJobPage.jsx        # Post/edit job + AI improve
        │   └── ProfilePage.jsx        # Profile + resume upload
        ├── utils/
        │   └── api.js          # Axios instance with interceptors
        └── App.jsx             # Router + Protected routes
```

---

## 🔑 Demo Accounts

Use these on the login page:

| Role | Email | Password |
|------|-------|----------|
| Job Seeker | demo.seeker@talentai.com | demo123 |
| Recruiter | demo.recruiter@talentai.com | demo123 |
| Admin | demo.admin@talentai.com | demo123 |

> **Note**: Create these accounts manually via the Register page or seed script.

---

## 🌐 Deployment

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all environment variables

### Frontend (Vercel)
1. Create new project on Vercel
2. Set root directory to `frontend`
3. Add env variable: `VITE_API_URL=https://your-backend.onrender.com/api`
4. Update `frontend/src/utils/api.js` baseURL to use `VITE_API_URL`

---

## 📸 Features Demo

| Feature | Description |
|---------|-------------|
| 🔍 Smart Search | Full-text search + filters |
| 🤖 AI Cover Letter | Auto-generated personalized cover letters |
| 📊 Resume Scoring | AI scores 0-100% match for recruiter |
| 🔔 Real-time Alerts | Socket.io notifications |
| 📱 Responsive | Mobile-first design |
| 🌙 Dark Theme | Modern dark UI with accent colors |

---

## 👨‍💻 Built With ❤️ for Unified Internship Program

> This project demonstrates: MERN Stack, REST APIs, JWT Authentication, Socket.io, OpenAI Integration, Cloud File Storage, Role-based Access Control, and modern React patterns.
