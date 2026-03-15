/**
 * Computes expected statement processing duration (ms) from historical completed jobs.
 * Uses pdfSizeBytes and transactionCount when available for better accuracy.
 */
const StatementJob = require('../models/StatementJob');

const DEFAULT_DURATION_MS = 90 * 1000; // 90 seconds
const MIN_SAMPLES_FOR_AVG = 1;
/** Size tolerance: consider jobs "similar" if size is within this ratio (0.5 = half to double). */
const SIZE_RATIO_MIN = 0.5;
const SIZE_RATIO_MAX = 2;

/**
 * Get expected duration in ms for a statement job, based on historical completed jobs.
 * @param {object} options
 * @param {string} [options.userId] - If set, prefer this user's history; otherwise use all.
 * @param {number} [options.pdfSizeBytes] - If set, average over jobs with similar size.
 * @param {number} [options.transactionCount] - If set (e.g. from a previous estimate), can be used for weighting (optional).
 * @returns {Promise<{ expectedDurationMs: number, expectedDurationSec: number, basedOn: string, sampleCount?: number }>}
 */
async function getExpectedDurationMs(options = {}) {
  const { userId, pdfSizeBytes } = options;

  const baseMatch = { status: 'completed', durationMs: { $exists: true, $gt: 0 } };
  if (userId) baseMatch.userId = userId;

  const completed = await StatementJob.find(baseMatch)
    .select('durationMs pdfSizeBytes transactionCount')
    .lean()
    .sort({ completedAt: -1 })
    .limit(200);

  if (!completed.length) {
    return {
      expectedDurationMs: DEFAULT_DURATION_MS,
      expectedDurationSec: Math.ceil(DEFAULT_DURATION_MS / 1000),
      basedOn: 'default',
    };
  }

  let candidates = completed;

  if (pdfSizeBytes != null && pdfSizeBytes > 0) {
    const similar = completed.filter((j) => {
      const s = j.pdfSizeBytes;
      if (s == null || s <= 0) return false;
      const ratio = pdfSizeBytes / s;
      return ratio >= SIZE_RATIO_MIN && ratio <= SIZE_RATIO_MAX;
    });
    if (similar.length >= MIN_SAMPLES_FOR_AVG) {
      candidates = similar;
    }
  }

  const total = candidates.reduce((sum, j) => sum + j.durationMs, 0);
  const avgMs = Math.round(total / candidates.length);
  const clampedMs = Math.max(20 * 1000, Math.min(300 * 1000, avgMs)); // 20s–5min

  return {
    expectedDurationMs: clampedMs,
    expectedDurationSec: Math.ceil(clampedMs / 1000),
    basedOn: pdfSizeBytes != null && candidates.some((j) => j.pdfSizeBytes != null) ? 'size' : 'overall',
    sampleCount: candidates.length,
  };
}

module.exports = { getExpectedDurationMs, DEFAULT_DURATION_MS };
