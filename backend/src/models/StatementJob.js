const mongoose = require('mongoose');

const JOB_TYPES = ['s3', 'base64'];
const JOB_STATUSES = ['pending', 'processing', 'completed', 'failed'];

const statementJobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: [true, 'User ID is required'],
    },
    type: {
      type: String,
      enum: JOB_TYPES,
      required: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: JOB_STATUSES,
      default: 'pending',
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    /** PDF size in bytes (set at create for base64, or at processing start for s3). */
    pdfSizeBytes: { type: Number, default: null },
    /** Processing duration in ms (set when status becomes completed). */
    durationMs: { type: Number, default: null },
    /** Number of transactions added (set when completed). */
    transactionCount: { type: Number, default: null },
  },
  { timestamps: true }
);

statementJobSchema.index({ status: 1, createdAt: 1 });
statementJobSchema.index({ userId: 1, createdAt: -1 });
statementJobSchema.index({ status: 1, durationMs: 1, pdfSizeBytes: 1, transactionCount: 1 });

module.exports = mongoose.model('StatementJob', statementJobSchema);
