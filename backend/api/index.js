/**
 * Vercel serverless entry: all routes are handled by the Express app.
 * Set in vercel.json: "rewrites" to send (.*) here.
 */
const app = require('../src/app');

module.exports = app;
