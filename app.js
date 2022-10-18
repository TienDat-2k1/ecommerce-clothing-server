import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import * as dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import corsOptions from './config/corsOptions.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './Controller/errorController.js';
import categoryRouter from './routes/categoryRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import credentials from './config/credentials.js';

dotenv.config({ path: './config.env' });
const app = express();

app.enable('trust proxy');

// GLOBAL MIDDLEWARE

app.use(credentials);
app.use(cors(corsOptions));
// app.use(cors());
// app.options('*', cors());

// Serving static file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Security HTTP headers
// app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(helmet());

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handle options credentials check - before Cors
// and fetch cookies credentials requirement

// app.use(credentials);

// if (process.env.NODE_ENV === 'production') {
//   app.use((req, res, next) => {
//     if (req.header('x-forwarded-proto') !== 'https')
//       res.redirect(`https://${req.header('host')}${req.url}`);
//     else next();
//   });
// }

// allow 100 requests from the same IP in 1 hour
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: `Too many requests from this IP, please try again in an hour!`,
// });
// app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);
// cookies
app.use(cookieParser());

// Data sanitization against NOSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);
app.use(compression());

// app.use(' /images', express.static('public/img/products'));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// Route
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/user', userRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/orders', orderRouter);

app.get('*', (req, res, next) => {
  next(new AppError(`Can't not find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
