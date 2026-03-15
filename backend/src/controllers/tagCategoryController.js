const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const TagCategory = require('../models/TagCategory');

/**
 * GET /api/tag-categories
 * Query: transactionType (optional) 'credit' | 'debit' - filter by category type
 * Returns all tag categories (groups) with sub-items. Public read.
 */
const getCategories = async (req, res, next) => {
  try {
    const { transactionType } = req.query;

    const filter = { isActive: true };

    if (transactionType === 'credit' || transactionType === 'debit') {
      filter.$or = [
        { isActive: true, categoryType: transactionType },
        { isActive: true, categoryType: 'both' },
      ];
    }

    const categories = await TagCategory.find(filter)
      .sort({ sortOrder: 1, label: 1 })
      .lean();

    res.status(StatusCodes.OK).json({
      success: true,
      data: categories,
      meta: { count: categories.length },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tag-categories/:slug
 * Returns a single category by slug.
 */
const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await TagCategory.findOne({
      slug,
      isActive: true,
    }).lean();

    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Tag category not found',
        errorCode: 'TAG_CATEGORY_NOT_FOUND',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tag-categories
 * Create a new tag category (admin/system).
 * Body: slug, label, description, iconName, iconSvg?, categoryType, sortOrder?, subItems[].
 * iconName should match the shared frontend tag icon registry export name.
 * iconSvg is retained for backward compatibility, but the app now prefers iconName.
 */
const createCategory = async (req, res, next) => {
  try {
    const existing = await TagCategory.findOne({ slug: req.body.slug });
    if (existing) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'A category with this slug already exists',
        errorCode: 'SLUG_ALREADY_EXISTS',
      });
    }

    const category = await TagCategory.create(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Tag category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/tag-categories/:id
 * Update a tag category.
 * Body: label, description, iconName, iconSvg, categoryType, sortOrder, subItems, isActive.
 * iconName should stay aligned with the frontend tag icon registry export name.
 */
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid category ID',
        errorCode: 'INVALID_ID',
      });
    }

    const allowedFields = [
      'slug',
      'label',
      'description',
      'iconName',
      'iconSvg',
      'categoryType',
      'sortOrder',
      'subItems',
      'isActive',
    ];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const category = await TagCategory.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Tag category not found',
        errorCode: 'TAG_CATEGORY_NOT_FOUND',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Tag category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tag-categories/:id
 * Soft-delete: set isActive = false.
 */
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid category ID',
        errorCode: 'INVALID_ID',
      });
    }

    const category = await TagCategory.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );

    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Tag category not found',
        errorCode: 'TAG_CATEGORY_NOT_FOUND',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Tag category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tag-categories/seed
 * Upsert all default categories from seed data. Idempotent by slug.
 */
const seedCategories = async (req, res, next) => {
  try {
    const seedData = require('../data/tagCategorySeed.json');

    let created = 0;
    let updated = 0;

    for (const item of seedData) {
      const existing = await TagCategory.findOne({ slug: item.slug });
      await TagCategory.findOneAndUpdate(
        { slug: item.slug },
        {
          $set: {
            label: item.label,
            description: item.description || '',
            // Keep the canonical frontend icon key in sync with seeded tag definitions.
            iconName: item.iconName || 'OthersIcon',
            iconSvg: item.iconSvg || null,
            categoryType: item.categoryType || 'debit',
            sortOrder: item.sortOrder ?? 0,
            subItems: item.subItems || [],
            isActive: true,
          },
        },
        { upsert: true, new: true }
      );
      if (existing) updated += 1;
      else created += 1;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Tag categories seeded successfully',
      data: { created, updated, total: seedData.length },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  seedCategories,
};
