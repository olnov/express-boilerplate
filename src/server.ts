import app from './app';
import http from 'http';
import logger from '@config/logger';
import { connectDB } from '@config/db';

const PORT: number = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV: string = process.env.NODE_ENV || 'development';

const server = new http.Server(app);

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on(
  'unhandledRejection',
  (reason: unknown, promise: Promise<unknown>) => {
    logger.error('Unhandled Rejection at:', promise, 'reason', reason);
    process.exit(1);
  },
);

// Graceful shutdown
const shutdown = () => {
  logger.info('Received shutdown signal, shutting down gracefully...', {
    module: 'server',
  });
  server.close(() => {
    logger.info('Server gracefully shut down', { module: 'server' });
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start server
server.listen(PORT, () => {
  logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`, {
    module: 'server',
  });
  logger.info(`Visit http://localhost:${PORT} to access the application`, {
    module: 'server',
  });
});

// Connect to the database
(async () => {
  try {
    await connectDB();
    logger.info('Database connection established', { module: 'server' });
  } catch (error) {
    logger.error('Failed to connect to the database:', error, {
      module: 'server',
    });
    process.exit(1);
  }
})();
