const crypto = require('crypto');

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const LENGTH = 5;

/**
 * Generates a unique 5-character uppercase alphanumeric ID.
 * @returns {string}
 */
function generateSpecificId() {
  let result = '';
  const randomBytes = crypto.randomBytes(LENGTH);
  for (let i = 0; i < LENGTH; i++) {
    result += CHARS[randomBytes[i] % CHARS.length];
  }
  return result;
}

module.exports = { generateSpecificId };
