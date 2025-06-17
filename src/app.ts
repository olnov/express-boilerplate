import express from 'express';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import logger from '@config/logger';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import exampleRouter from '@routes/example.route';
import 'dotenv/config';

const app = express();

// Security headers
app.use(
  helmet({
    noSniff: true, // Block MIME type sniffing
    xssFilter: true, // Enable XSS protection
    contentSecurityPolicy: false, // Should be configured at the proxy level
    hsts: false, // Should be configured at the proxy level
    hidePoweredBy: true, // Hide the "X-Powered-By" header
  }),
);

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes time window
    max: 100, // limit each IP to 100 requests per window
  }),
);

// CORS configuration
const allowedOrigins = process.env.CLIENT_ORIGINS
  ? process.env.CLIENT_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

// HTTP Logging middleware
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);
// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static assets
app.use(express.static('public'));

// API Routes
app.use('/api/example', exampleRouter);

export default app;
