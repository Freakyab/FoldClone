/**
 * When running the server locally (not on Vercel), process pending statement jobs
 * on an interval so PDF uploads complete without needing a separate cron.
 * Only runs when NODE_ENV !== 'production' and the app is started directly (e.g. nodemon).
 */
const StatementJob = require('../models/StatementJob');
const { processStatementJob } = require('./statementJobProcessor');

const INTERVAL_MS = 90 * 1000; // 90 seconds

function runOnce() {
  StatementJob.findOne({ status: 'pending' })
    .sort({ createdAt: 1 })
    .select('_id')
    .lean()
    .then((pending) => {
      if (!pending) return;
      const jobId = pending._id.toString();
      processStatementJob(jobId).catch((err) => {
        console.warn('[localStatementJobScheduler] Job failed:', jobId, err.message);
      });
    })
    .catch((err) => {
      console.warn('[localStatementJobScheduler] Error fetching pending job:', err.message);
    });
}

function startLocalStatementJobScheduler() {
  runOnce();
  const intervalId = setInterval(runOnce, INTERVAL_MS);
  console.log(`[localStatementJobScheduler] Started (every ${INTERVAL_MS / 1000}s)`);
  return intervalId;
}

module.exports = { startLocalStatementJobScheduler };
