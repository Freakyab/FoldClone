const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const Tag = require('../models/Tag');

const createTag = async (req, res, next) => {
  try {
    const existingTag = await Tag.findOne({
      userId: req.user.id,
      name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
      isDeleted: false,
    });

    if (existingTag) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'A tag with this name already exists',
        errorCode: 'TAG_ALREADY_EXISTS',
      });
    }

    const tag = await Tag.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Tag created successfully',
      data: tag,
    });
  } catch (error) {
    next(error);
  }
};

const getTags = async (req, res, next) => {
  try {
    const { search, isActive } = req.query;

    const filter = {
      userId: req.user.id,
      isDeleted: false,
    };

    if (isActive !== undefined) filter.isActive = isActive === 'true';

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const tags = await Tag.find(filter).sort({ name: 1 }).lean();

    res.status(StatusCodes.OK).json({
      success: true,
      data: tags,
      meta: {
        count: tags.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTagById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid tag ID',
        errorCode: 'INVALID_ID',
      });
    }

    const tag = await Tag.findOne({
      _id: id,
      userId: req.user.id,
      isDeleted: false,
    }).lean();

    if (!tag) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Tag not found',
        errorCode: 'TAG_NOT_FOUND',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: tag,
    });
  } catch (error) {
    next(error);
  }
};

const updateTag = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid tag ID',
        errorCode: 'INVALID_ID',
      });
    }

    const allowedFields = ['name', 'color', 'icon', 'description', 'isActive'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (updates.name) {
      const existingTag = await Tag.findOne({
        userId: req.user.id,
        name: { $regex: new RegExp(`^${updates.name}$`, 'i') },
        _id: { $ne: id },
        isDeleted: false,
      });

      if (existingTag) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: 'A tag with this name already exists',
          errorCode: 'TAG_ALREADY_EXISTS',
        });
      }
    }

    const tag = await Tag.findOneAndUpdate(
      { _id: id, userId: req.user.id, isDeleted: false },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!tag) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Tag not found',
        errorCode: 'TAG_NOT_FOUND',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Tag updated successfully',
      data: tag,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid tag ID',
        errorCode: 'INVALID_ID',
      });
    }

    const tag = await Tag.findOneAndUpdate(
      { _id: id, userId: req.user.id, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date(), isActive: false } },
      { new: true }
    );

    if (!tag) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Tag not found',
        errorCode: 'TAG_NOT_FOUND',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Tag deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTag,
  getTags,
  getTagById,
  updateTag,
  deleteTag,
};
