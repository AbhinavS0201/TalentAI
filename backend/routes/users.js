const router = require('express').Router();
const { uploadResume, uploadAvatar, getSavedJobs, getDashboardStats, getAllUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.post('/upload-resume', protect, uploadResume);
router.post('/upload-avatar', protect, uploadAvatar);
router.get('/saved-jobs', protect, authorize('jobseeker'), getSavedJobs);
router.get('/dashboard-stats', protect, getDashboardStats);
router.get('/all', protect, authorize('admin'), getAllUsers);

module.exports = router;
