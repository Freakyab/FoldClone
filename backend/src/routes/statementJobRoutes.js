const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getJobStatus } = require('../controllers/statementJobController');

router.use(protect);
router.get('/:jobId', getJobStatus);

module.exports = router;
