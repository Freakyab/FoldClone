const { StatusCodes } = require('http-status-codes');
const Profile = require('../models/Profile');

const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.user.id).lean();

    if (!profile) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Profile not found',
        errorCode: 'PROFILE_NOT_FOUND',
      });
    }

    const { password, ...safeProfile } = profile;

    res.status(StatusCodes.OK).json({
      success: true,
      data: safeProfile,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'phone', 'avatar'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const profile = await Profile.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!profile) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Profile not found',
        errorCode: 'PROFILE_NOT_FOUND',
      });
    }

    const { password, ...safeProfile } = profile;

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Profile updated successfully',
      data: safeProfile,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findByIdAndUpdate(
      req.user.id,
      { $set: { isActive: false } },
      { new: true }
    );

    if (!profile) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Profile not found',
        errorCode: 'PROFILE_NOT_FOUND',
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Account deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const profile = await Profile.findById(req.user.id).select('+password');

    if (!profile) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Profile not found',
        errorCode: 'PROFILE_NOT_FOUND',
      });
    }

    const isMatch = await profile.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Current password is incorrect',
        errorCode: 'INVALID_PASSWORD',
      });
    }

    profile.password = newPassword;
    await profile.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  changePassword,
};
