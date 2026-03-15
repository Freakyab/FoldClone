/**
 * AES-256-GCM encryption for statement passwords at rest.
 * Set STATEMENT_PASSWORD_ENCRYPTION_KEY in env (32-byte hex string, or any string to be SHA-256 hashed).
 * If unset, passwords are stored in plaintext for backward compatibility.
 */
const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ENCRYPTED_PREFIX = 'v1:';

function getKey() {
  const raw = process.env.STATEMENT_PASSWORD_ENCRYPTION_KEY;
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (trimmed.length >= 64 && /^[0-9a-fA-F]+$/.test(trimmed)) {
    return Buffer.from(trimmed.slice(0, 64), 'hex').slice(0, KEY_LENGTH);
  }
  return crypto.createHash('sha256').update(trimmed, 'utf8').digest();
}

/**
 * Encrypt a statement password for storage. Returns plaintext if no key is configured.
 * @param {string} plaintext
 * @returns {string}
 */
function encrypt(plaintext) {
  const key = getKey();
  if (!key) return plaintext;

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  const payload = Buffer.concat([iv, encrypted, authTag]);
  return ENCRYPTED_PREFIX + payload.toString('base64');
}

/**
 * Decrypt a stored value. Returns as-is if not encrypted (legacy plaintext) or if no key.
 * @param {string} stored
 * @returns {string|null} Decrypted password or null on failure.
 */
function decrypt(stored) {
  if (!stored || typeof stored !== 'string') return null;

  if (!stored.startsWith(ENCRYPTED_PREFIX)) {
    return stored;
  }

  const key = getKey();
  if (!key) return stored;

  try {
    const payload = Buffer.from(stored.slice(ENCRYPTED_PREFIX.length), 'base64');
    if (payload.length < IV_LENGTH + AUTH_TAG_LENGTH) return null;
    const iv = payload.subarray(0, IV_LENGTH);
    const authTag = payload.subarray(payload.length - AUTH_TAG_LENGTH);
    const ciphertext = payload.subarray(IV_LENGTH, payload.length - AUTH_TAG_LENGTH);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
    decipher.setAuthTag(authTag);
    return decipher.update(ciphertext) + decipher.final('utf8');
  } catch {
    return null;
  }
}

module.exports = { encrypt, decrypt };
