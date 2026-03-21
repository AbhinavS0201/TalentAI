const router = require('express').Router();
const { generateCoverLetter, scoreResume, getJobSuggestions, improveJobDescription } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/auth');

router.post('/cover-letter', protect, generateCoverLetter);
router.post('/score-resume', protect, authorize('recruiter', 'admin'), scoreResume);
router.get('/job-suggestions', protect, authorize('jobseeker'), getJobSuggestions);
router.post('/improve-job', protect, authorize('recruiter', 'admin'), improveJobDescription);

module.exports = router;
