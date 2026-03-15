const mongoose = require('mongoose');

const statementPasswordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: [true, 'User ID is required'],
    },
    bankName: {
      type: String,
      trim: true,
      required: [true, 'Bank name is required'],
      maxlength: [120, 'Bank name cannot exceed 120 characters'],
    },
    accountNumber: {
      type: String,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      required: [true, 'Statement password is required'],
      maxlength: [512, 'Statement password storage cannot exceed 512 characters'],
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

statementPasswordSchema.index({ userId: 1, lastUsedAt: -1 });

module.exports = mongoose.model('StatementPassword', statementPasswordSchema);
