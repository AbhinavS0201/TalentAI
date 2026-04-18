// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import your User model
const User = require('./models/User'); // adjust path if needed

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected (Seeding)');

    // Check if already exists
    const existing = await User.findOne({ email: 'demo.seeker@talentai.com' });

    if (existing) {
      console.log('⚠️ Demo users already exist');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('demo123', 10);

    const users = [
      {
        name: "Demo Seeker",
        email: "demo.seeker@talentai.com",
        password: hashedPassword,
        role: "jobseeker"
      },
      {
        name: "Demo Recruiter",
        email: "demo.recruiter@talentai.com",
        password: hashedPassword,
        role: "recruiter"
      }
    ];

    await User.insertMany(users);

    console.log('🎉 Demo users created successfully!');
    process.exit();

  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedUsers();
