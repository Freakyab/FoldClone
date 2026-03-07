const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tag name is required"],
      trim: true,
      maxlength: [50, "Tag name cannot exceed 50 characters"],
    },
    icon: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
      default: null,
    },
    group: {
      type: String,
      required: [true, "Tag group is required"],
      trim: true,
      maxlength: [50, "Tag group cannot exceed 50 characters"],
    },
  },
  {
    timestamps: true,
  },
);

tagSchema.index(
  { name: 1, group: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
module.exports = mongoose.model("Tag", tagSchema);
