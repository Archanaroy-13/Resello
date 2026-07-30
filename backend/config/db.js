const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('MONGO_URI is missing in backend/.env file. Please specify your MongoDB Atlas connection string.');
    }

    // Ensure database name 'resello' is specified if mongodb+srv Atlas URI missing database path
    if (uri.startsWith('mongodb+srv://') && uri.includes('/?') && !uri.includes('.net/resello')) {
      uri = uri.replace('.net/?', '.net/resello?');
    } else if (uri.startsWith('mongodb+srv://') && uri.endsWith('.net/')) {
      uri = uri + 'resello';
    }

    const conn = await mongoose.connect(uri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
