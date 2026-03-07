const { StatusCodes } = require('http-status-codes');
const authService = require('../services/authService');

const signUp = async (req, res, next) => {
  try {
    const { user, token } = await authService.signUp(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Account created successfully',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Logged in successfully',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signUp, login };
