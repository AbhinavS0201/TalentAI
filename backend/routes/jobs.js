const router = require('express').Router();
const { getJobs, getJob, createJob, updateJob, deleteJob, getMyJobs, toggleSaveJob, getCategories } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getJobs);
router.get('/categories', getCategories);
router.get('/my-jobs', protect, authorize('recruiter', 'admin'), getMyJobs);
router.get('/:id', getJob);
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);
router.post('/:id/save', protect, authorize('jobseeker'), toggleSaveJob);

module.exports = router;
