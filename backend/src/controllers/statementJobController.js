const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const StatementJob = require('../models/StatementJob');
const { processStatementJob } = require('../services/statementJobProcessor');
const { getExpectedDurationMs } = require('../services/expectedDurationService');

const getJobStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid job ID',
        errorCode: 'INVALID_ID',
      });
    }

    const job = await StatementJob.findOne({
      _id: jobId,
      userId: req.user.id,
    }).lean();

    if (!job) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Job not found',
        errorCode: 'JOB_NOT_FOUND',
      });
    }

    const { expectedDurationSec, expectedDurationMs, basedOn, sampleCount } = await getExpectedDurationMs({
      userId: req.user.id,
      pdfSizeBytes: job.pdfSizeBytes ?? undefined,
    });

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        jobId: job._id,
        status: job.status,
        result: job.result,
        error: job.error,
        createdAt: job.createdAt,
        startedAt: job.startedAt,
        completedAt: job.completedAt,
        pdfSizeBytes: job.pdfSizeBytes ?? undefined,
        durationMs: job.durationMs ?? undefined,
        transactionCount: job.transactionCount ?? undefined,
        expectedDurationSec,
        expectedDurationMs,
        expectedDurationBasedOn: basedOn,
        expectedDurationSampleCount: sampleCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Called by Vercel Cron. Processes one pending statement job.
 * Secured by CRON_SECRET (set in Vercel env); cron requests include Authorization: Bearer <CRON_SECRET>.
 */
const processNextStatementJob = async (req, res, next) => {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.authorization;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Unauthorized',
        errorCode: 'CRON_AUTH_REQUIRED',
      });
    }

    const pending = await StatementJob.findOne({ status: 'pending' })
      .sort({ createdAt: 1 })
      .select('_id')
      .lean();

    if (!pending) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'No pending jobs',
        processed: 0,
      });
    }

    try {
      await processStatementJob(pending._id.toString());
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Job processed',
        processed: 1,
        jobId: pending._id.toString(),
      });
    } catch (jobError) {
      // Job is already marked failed in DB; return 200 so Vercel cron does not retry
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'Job failed (see job result)',
        processed: 1,
        jobId: pending._id.toString(),
        error: jobError.message,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobStatus,
  processNextStatementJob,
};
