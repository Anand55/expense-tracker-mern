import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.mongoUri);
    logger.info('MongoDB Connected');
  } catch (err) {
    logger.error('MongoDB connection error', err);
    throw err;
  }
}

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});
