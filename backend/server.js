const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ================= GLOBAL ERROR HANDLING =================
// DO NOT exit immediately → we want to see full errors
process.on('uncaughtException', err => {
  console.error('❌ Uncaught Exception FULL:', err);
});

process.on('unhandledRejection', err => {
  console.error('❌ Unhandled Rejection FULL:', err);
});

// ================= MIDDLEWARE =================
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible in routes
app.set('io', io);

// ================= ROUTES =================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/users', require('./routes/users'));
app.use('/api/notifications', require('./routes/notifications'));

// ================= HEALTH CHECK =================
app.get('/', (req, res) => {
  res.json({ message: 'AI Job Portal API Running 🚀' });
});

// ================= SOCKET LOGIC =================
const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('join', (userId) => {
    connectedUsers[userId] = socket.id;
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);

    Object.keys(connectedUsers).forEach(key => {
      if (connectedUsers[key] === socket.id) {
        delete connectedUsers[key];
      }
    });
  });
});

// ================= DEBUG LOG =================
console.log("🔍 MONGO_URI:", process.env.MONGO_URI);

// ================= DATABASE CONNECTION =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Error FULL:', err);
    console.log("🔍 MONGO_URI:", process.env.MONGO_URI);
  });
