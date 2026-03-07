const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const Profile = require('../models/Profile');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Access denied. No token provided.',
        errorCode: 'NO_TOKEN',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const profile = await Profile.findById(decoded.id).select('_id role isActive').lean();

    if (!profile) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'User no longer exists',
        errorCode: 'USER_NOT_FOUND',
      });
    }

    if (!profile.isActive) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Account is deactivated',
        errorCode: 'ACCOUNT_DEACTIVATED',
      });
    }

    req.user = { id: profile._id.toString(), role: profile.role };
    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'You do not have permission to perform this action',
        errorCode: 'FORBIDDEN',
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
