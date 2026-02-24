import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    logger.error('MONGO_URI is required');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    logger.info('MongoDB Connected');
  } catch (err) {
    logger.error('MongoDB connection error', err);
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});
