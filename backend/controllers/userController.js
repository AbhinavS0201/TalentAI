const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { uploadResume, uploadAvatar } = require('../config/cloudinary');

exports.uploadResume = [
  uploadResume.single('resume'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { resume: req.file.path, resumeName: req.file.originalname },
        { new: true }
      ).select('-password');
      res.json({ resume: user.resume, resumeName: user.resumeName, user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

exports.uploadAvatar = [
  uploadAvatar.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { avatar: req.file.path },
        { new: true }
      ).select('-password');
      res.json({ avatar: user.avatar, user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];

exports.getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');
    res.json(user.savedJobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    if (req.user.role === 'jobseeker') {
      const applications = await Application.find({ applicant: req.user._id });
      const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        shortlisted: applications.filter(a => a.status === 'shortlisted').length,
        interview: applications.filter(a => a.status === 'interview').length,
        offered: applications.filter(a => a.status === 'offered').length,
        rejected: applications.filter(a => a.status === 'rejected').length,
      };
      res.json(stats);
    } else if (req.user.role === 'recruiter') {
      const jobs = await Job.find({ postedBy: req.user._id });
      const jobIds = jobs.map(j => j._id);
      const applications = await Application.find({ job: { $in: jobIds } });
      const stats = {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(j => j.isActive).length,
        totalApplications: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        shortlisted: applications.filter(a => a.status === 'shortlisted').length,
        totalViews: jobs.reduce((sum, j) => sum + j.views, 0),
      };
      res.json(stats);
    } else {
      const totalUsers = await User.countDocuments();
      const totalJobs = await Job.countDocuments();
      const totalApplications = await Application.countDocuments();
      res.json({ totalUsers, totalJobs, totalApplications });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
