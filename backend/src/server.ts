import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './index';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ Error: MONGO_URI is not defined in environment variables.');
  process.exit(1);
}

// ─── Connect to MongoDB & Start Server ────────────────────────────────────────
const startServer = async (): Promise<void> => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Smart Leads API running on port ${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:');
    console.error(error);
    process.exit(1);
  }
};

// ─── Graceful Shutdown ─────────────────────────────────────────────────────────
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

startServer();
