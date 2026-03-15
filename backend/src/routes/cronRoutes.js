const express = require('express');
const router = express.Router();
const { processNextStatementJob } = require('../controllers/statementJobController');

// GET for Vercel Cron (default); POST for manual/external triggers
router.get('/process-statement-jobs', processNextStatementJob);
router.post('/process-statement-jobs', processNextStatementJob);

module.exports = router;
