const mongoose = require('mongoose');

const TRANSACTION_TYPES = ['credit', 'debit', 'transfer'];
const TRANSACTION_STATUS = ['pending', 'completed', 'failed', 'cancelled'];
const PAYMENT_MODES = ['upi', 'cash', 'card', 'net_banking', 'wallet', 'other'];

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: [true, 'User ID is required'],
    },
    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bank',
      default: null,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: TRANSACTION_TYPES,
      required: [true, 'Transaction type is required'],
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Note cannot exceed 1000 characters'],
    },
    transactionDate: {
      type: Date,
      required: [true, 'Transaction date is required'],
      default: Date.now,
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      maxlength: 3,
    },
    accountIn: {
      type: String,
      required: [true, 'Account in is required'],
      trim: true,
      maxlength: [100, 'Account in cannot exceed 100 characters'],
    },
    excludedFromCashFlow: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
