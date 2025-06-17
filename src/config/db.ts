import mongoose from 'mongoose';
import logger from '@config/logger';

const MONGODB_URI = process.env.MONGODB_URI;

export const connectDB = async () => {
    if (!MONGODB_URI) {
        logger.error('MONGODB_URI is not defined', { module: 'db' });
        process.exit(1);
    }
  try {
    await mongoose.connect(MONGODB_URI, {
      autoIndex: true,
    });

    logger.info(`Connected to: ${MONGODB_URI}`, { module: 'db' });
  } catch (error) {
    logger.error('Connection error:', error, { module: 'db' });
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    logger.warn('Disconnected from MongoDB', { module: 'db' });
  });
};
