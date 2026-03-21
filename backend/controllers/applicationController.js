const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

exports.apply = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const job = await Job.findById(jobId).populate('postedBy');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const existing = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already applied to this job' });

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resume: req.user.resume,
      resumeName: req.user.resumeName,
    });

    job.applicants.push(application._id);
    await job.save();

    // Notify recruiter
    const io = req.app.get('io');
    const notification = await Notification.create({
      recipient: job.postedBy._id,
      type: 'application_received',
      title: 'New Application Received',
      message: `${req.user.name} applied for ${job.title}`,
      link: `/recruiter/applications/${application._id}`,
      data: { applicationId: application._id }
    });
    io.to(job.postedBy._id.toString()).emit('notification', notification);

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location type salaryMin salaryMax companyLogo')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email avatar skills experience education resume')
      .sort({ aiScore: -1, createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, notes, interviewDate } = req.body;
    const application = await Application.findById(req.params.id).populate('job').populate('applicant');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = status;
    if (notes) application.notes = notes;
    if (interviewDate) application.interviewDate = interviewDate;
    await application.save();

    // Notify applicant
    const io = req.app.get('io');
    const statusMessages = {
      reviewed: 'Your application has been reviewed',
      shortlisted: '🎉 You have been shortlisted!',
      interview: '🎯 Interview scheduled for you',
      offered: '🎊 Congratulations! You have received an offer',
      rejected: 'Application status updated'
    };
    const notification = await Notification.create({
      recipient: application.applicant._id,
      type: 'status_update',
      title: 'Application Status Updated',
      message: `${statusMessages[status]} for ${application.job.title}`,
      link: `/applications/${application._id}`,
    });
    io.to(application.applicant._id.toString()).emit('notification', notification);

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('applicant', '-password');
    if (!application) return res.status(404).json({ message: 'Not found' });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).select('_id');
    const jobIds = jobs.map(j => j._id);
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title company')
      .populate('applicant', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
