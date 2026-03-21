const router = require('express').Router();
const { apply, getMyApplications, getJobApplications, updateStatus, getApplication, getAllApplications } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('jobseeker'), apply);
router.get('/my', protect, authorize('jobseeker'), getMyApplications);
router.get('/all', protect, authorize('recruiter', 'admin'), getAllApplications);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplications);
router.get('/:id', protect, getApplication);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateStatus);

module.exports = router;
