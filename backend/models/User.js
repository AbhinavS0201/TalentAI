const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['jobseeker', 'recruiter', 'admin'], default: 'jobseeker' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  phone: { type: String, default: '' },
  skills: [{ type: String }],
  experience: { type: String, default: '' },
  education: { type: String, default: '' },
  resume: { type: String, default: '' },
  resumeName: { type: String, default: '' },
  company: {
    name: { type: String, default: '' },
    website: { type: String, default: '' },
    logo: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  isVerified: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
