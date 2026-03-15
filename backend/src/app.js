const config = require('./config/env');
const os = require('os');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const { startLocalStatementJobScheduler } = require('./services/localStatementJobScheduler');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const bankRoutes = require('./routes/bankRoutes');
const homeRoutes = require('./routes/homeRoutes');
const tagCategoryRoutes = require('./routes/tagCategoryRoutes');
const storageRoutes = require('./routes/storageRoutes');
const statementJobRoutes = require('./routes/statementJobRoutes');
const cronRoutes = require('./routes/cronRoutes');

const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    errorCode: 'RATE_LIMIT_EXCEEDED',
  },
});
app.use('/api', limiter);

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/banks', bankRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/tag-categories', tagCategoryRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/jobs', statementJobRoutes);
app.use('/api/cron', cronRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    errorCode: 'NOT_FOUND',
  });
});

app.use(errorHandler);

// Only listen when run directly (e.g. node src/app.js); skip when required by Vercel serverless
if (require.main === module) {
  app.listen(config.port, () => {
    const interfaces = os.networkInterfaces();
    const hosts = [];

    Object.values(interfaces).forEach((nets) => {
      if (!nets) return;
      nets.forEach((net) => {
        if (net.family === 'IPv4' && !net.internal) {
          hosts.push(`http://${net.address}:${config.port}`);
        }
      });
    });

    console.log(`Server running on port ${config.port} [${config.nodeEnv}]`);
    if (hosts.length > 0) {
      console.log(`Accessible at: ${hosts.join(', ')}`);
    } else {
      console.log('Accessible at: (no external IPv4 address detected)');
    }

    if (config.nodeEnv !== 'production') {
      startLocalStatementJobScheduler();
    }
  });
}

module.exports = app;
