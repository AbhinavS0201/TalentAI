const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, default: '' },
  resume: { type: String, default: '' },
  resumeName: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'interview', 'offered', 'rejected'],
    default: 'pending'
  },
  aiScore: { type: Number, default: 0 },
  aiAnalysis: { type: String, default: '' },
  notes: { type: String, default: '' },
  interviewDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
