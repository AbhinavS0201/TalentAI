const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  company: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  location: { type: String, required: true },
  type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'], default: 'full-time' },
  category: { type: String, required: true },
  skills: [{ type: String }],
  experience: { type: String, enum: ['fresher', '1-2 years', '2-5 years', '5-10 years', '10+ years'], default: 'fresher' },
  salaryMin: { type: Number, default: 0 },
  salaryMax: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  deadline: { type: Date },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

jobSchema.index({ title: 'text', description: 'text', company: 'text', skills: 'text' });

module.exports = mongoose.model('Job', jobSchema);
