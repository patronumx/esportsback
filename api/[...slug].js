// Vercel serverless function - catch-all for Express API
const app = require('../server/index.js');

// Export the Express app as a Vercel serverless function
module.exports = app;
