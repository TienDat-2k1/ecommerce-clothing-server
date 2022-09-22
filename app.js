import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import productRouter from './routes/productRoutes.js';
import * as dotenv from 'dotenv';
import collectionRoute from './routes/collectionRoutes.js';
import AppError from './utils/appError.js';
import globalErrorHandler from './Controller/errorController.js';
import userRoute from './routes/userRoutes.js';

dotenv.config({ path: './config.env' });
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

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
