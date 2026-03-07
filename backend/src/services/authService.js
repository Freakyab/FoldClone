const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');
const config = require('../config/env');
const { generateSpecificId } = require('../utils/generateSpecificId');

/**
 * Create a new user (sign up). Password is hashed by Profile pre-save hook.
 * @param {Object} payload - { name, email, password, username, phone? }
 * @returns {Promise<{ user: Object, token: string }>}
 */
async function signUp(payload) {
  const specificId = generateSpecificId();
  const profile = await Profile.create({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    username: payload.username,
    specificId,
    ...(payload.phone && { phone: payload.phone }),
  });

  const token = jwt.sign(
    { id: profile._id },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  const user = profile.toSafeObject ? profile.toSafeObject() : profile.toObject();
  delete user.password;
  return { user, token };
}

/**
 * Authenticate user and issue JWT. Updates lastLoginAt.
 * @param {Object} payload - { email, password }
 * @returns {Promise<{ user: Object, token: string }>}
 */
async function login(payload) {
  const profile = await Profile.findOne({ email: payload.email.toLowerCase() }).select(
    '+password'
  );

  if (!profile) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.errorCode = 'INVALID_CREDENTIALS';
    throw error;
  }

  const isMatch = await profile.comparePassword(payload.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.errorCode = 'INVALID_CREDENTIALS';
    throw error;
  }

  await Profile.findByIdAndUpdate(profile._id, {
    $set: { lastLoginAt: new Date() },
  });

  const token = jwt.sign(
    { id: profile._id.toString() },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  const user = profile.toSafeObject ? profile.toSafeObject() : profile.toObject();
  return { user, token };
}

module.exports = { signUp, login };
