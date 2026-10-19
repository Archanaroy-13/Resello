const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (mongoose.connection.readyState >= 1) {
          clearInterval(interval);
          resolve(mongoose.connection);
        }
      }, 50);
    });
  }

  try {
    isConnecting = true;
    let uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('MONGO_URI is not defined. Please set MONGO_URI in your Vercel Project Environment Variables.');
    }

    // Ensure database name 'resello' is specified if mongodb+srv Atlas URI is missing database path
    if (uri.startsWith('mongodb+srv://') && uri.includes('/?') && !uri.includes('.net/resello')) {
      uri = uri.replace('.net/?', '.net/resello?');
    } else if (uri.startsWith('mongodb+srv://') && uri.endsWith('.net/')) {
      uri = uri + 'resello';
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnecting = false;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isConnecting = false;
    console.error(`[Database Error] ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
