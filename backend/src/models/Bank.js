const mongoose = require("mongoose");

const ACCOUNT_TYPES = [
  "savings",
  "current",
  "salary",
  "fixed_deposit",
  "recurring_deposit",
  "wallet",
  "credit_card",
  "other",
];

const bankSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: [true, "User ID is required"],
    },
    name: {
      type: String,
      required: [true, "Bank name is required"],
      trim: true,
      maxlength: [100, "Bank name cannot exceed 100 characters"],
    },
    accountHolderName: {
      type: String,
      required: [true, "Account holder name is required"],
      trim: true,
      maxlength: [100, "Account holder name cannot exceed 100 characters"],
    },
    accountNumber: {
      type: String,
      trim: true,
      default: null,
    },
    branch: {
      type: String,
      trim: true,
      default: null,
    },
    ifscCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },
    accountType: {
      type: String,
      enum: ACCOUNT_TYPES,
      default: "savings",
    },
    balance: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      maxlength: 3,
    },
    color: {
      type: String,
      default: "#4F46E5",
    },
  },
  {
    timestamps: true,
  },
);

bankSchema.index(
  { userId: 1, name: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

module.exports = mongoose.model("Bank", bankSchema);
