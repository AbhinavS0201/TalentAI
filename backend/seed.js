// backend/seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import your User model
const User = require('./models/User');

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected (Seeding)');

    // Hash password once
    const hashedPassword = await bcrypt.hash('demo123', 10);

    // Demo users
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
      },
      {
        name: "Demo Admin",
        email: "demo.admin@talentai.com",
        password: hashedPassword,
        role: "admin"
      }
    ];

    // Insert only if not already present
    for (const user of users) {
      const exists = await User.findOne({ email: user.email });

      if (!exists) {
        await User.create(user);
        console.log(`✅ Created: ${user.email}`);
      } else {
        console.log(`⚠️ Already exists: ${user.email}`);
      }
    }

    console.log('🎉 Seeding completed!');
    process.exit();

  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedUsers();