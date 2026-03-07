const mongoose = require('mongoose');

const CATEGORY_TYPES = ['credit', 'debit', 'both'];

const tagSubItemSchema = new mongoose.Schema(
  {
    tagKey: {
      type: String,
      required: [true, 'Tag key is required'],
      trim: true,
      maxlength: [80, 'Tag key cannot exceed 80 characters'],
    },
    label: {
      type: String,
      required: [true, 'Sub-item label is required'],
      trim: true,
      maxlength: [80, 'Label cannot exceed 80 characters'],
    },
    iconName: {
      type: String,
      trim: true,
      maxlength: [60, 'Icon name cannot exceed 60 characters'],
      default: 'OthersIcon',
    },
    iconSvg: {
      type: String,
      default: null,
      maxlength: [8000, 'SVG content cannot exceed 8000 characters'],
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const tagCategorySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      trim: true,
      maxlength: [60, 'Slug cannot exceed 60 characters'],
    },
    label: {
      type: String,
      required: [true, 'Category label is required'],
      trim: true,
      maxlength: [80, 'Label cannot exceed 80 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
      default: '',
    },
    iconName: {
      type: String,
      trim: true,
      maxlength: [60, 'Icon name cannot exceed 60 characters'],
      default: 'OthersIcon',
    },
    iconSvg: {
      type: String,
      default: null,
      maxlength: [8000, 'SVG content cannot exceed 8000 characters'],
    },
    categoryType: {
      type: String,
      enum: CATEGORY_TYPES,
      default: 'debit',
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    subItems: {
      type: [tagSubItemSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

tagCategorySchema.index({ categoryType: 1, sortOrder: 1 });
tagCategorySchema.index({ isActive: 1 });

module.exports = mongoose.model('TagCategory', tagCategorySchema);
