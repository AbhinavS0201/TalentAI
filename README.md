# TalentAI 🚀

An AI-powered job portal that connects job seekers and recruiters with smart features like resume analysis, job matching, and role-based dashboards.

---

## 🌐 Live Demo

* **Frontend (Vercel):** https://talent-ai-gamma.vercel.app
* **Backend (Render):** https://talentai-ovvw.onrender.com

---

## 👤 Demo Accounts

Use these accounts to test the application:

* **Job Seeker**

  * Email: `demo.seeker@talentai.com`
  * Password: `demo123`

* **Recruiter**

  * Email: `demo.recruiter@talentai.com`
  * Password: `demo123`

* **Admin**

  * Email: `demo.admin@talentai.com`
  * Password: `demo123`

---

## ⚙️ Tech Stack

* **Frontend:** React (Vite), Axios
* **Backend:** Node.js, Express
* **Database:** MongoDB Atlas
* **Authentication:** JWT
* **AI Integration:** OpenAI API
* **Deployment:** Vercel (Frontend), Render (Backend)

---

## 🧩 Features

* User Authentication (Login/Register)
* Role-based access (Admin / Recruiter / Job Seeker)
* Job posting & applications
* AI-powered resume/job insights
* Real-time updates (Socket.io)

---

## 🛠️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/AbhinavS0201/TalentAI.git
cd TalentAI
```

### 2. Install dependencies

**Backend**

```bash
cd backend
npm install
```

**Frontend**

```bash
cd ../frontend
npm install
```

---

### 3. Create `.env` file in `/backend`

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key
CLIENT_URL=http://localhost:5173
PORT=5000
```

---

### 4. Run the project

**Backend**

```bash
cd backend
npm run dev
```

**Frontend**

```bash
cd frontend
npm run dev
```

---

## ⚠️ Notes

* Backend may take a few seconds to respond initially (Render free tier sleep).
* Ensure MongoDB Atlas IP access is configured (`0.0.0.0/0` for testing).
* AI features require a valid OpenAI API key.

---

## 📌 Author

**Abhinav Rama**

GitHub: https://github.com/AbhinavS0201

---

## ⭐ Acknowledgements

* OpenAI for AI capabilities
* MongoDB Atlas for cloud database
* Render & Vercel for deployment

---
