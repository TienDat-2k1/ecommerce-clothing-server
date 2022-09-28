import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import productRouter from './routes/productRoutes.js';
import * as dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import collectionRoute from './routes/collectionRoutes.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './Controller/errorController.js';
import userRoute from './routes/userRoutes.js';

dotenv.config({ path: './config.env' });
const app = express();

// GLOBAL MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// allow 100 requests from the same IP in 1 hour
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: `Too many requests from this IP, please try again in an hour!`,
});
app.use('/api', limiter);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// Route
app.use('/api/products', productRouter);
app.use('/api/collections', collectionRoute);
app.use('/api/user', userRoute);

app.get('*', (req, res, next) => {
  next(new AppError(`Can't not find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
