const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

// Load environment variables with absolute path
dotenv.config({ path: path.resolve(__dirname, '.env') });

const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive CORS for dev & production setup
    }
  },
  credentials: true
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware to ensure DB connection is ready before handling API requests
app.use(async (req, res, next) => {
  // Allow health check without DB
  if (req.path === '/api/v1/health') {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: `Database connection unavailable: ${error.message}. Please verify your MongoDB Atlas connection string in Vercel environment variables.`
    });
  }
});

// API Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Resello Marketplace REST API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Route Mounts
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/products', require('./routes/productRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));

// 404 Route Handler for unmatched API paths
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only listen when running standalone (not inside Vercel serverless functions)
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Server] Resello Express backend listening on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

module.exports = app;
