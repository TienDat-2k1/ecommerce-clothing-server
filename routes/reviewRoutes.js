import express from 'express';
import * as reviewController from '../Controller/reviewController.js';
import * as authController from '../Controller/authController.js';

const reviewRouter = express.Router();

reviewRouter
  .route('/')
  .get(reviewController.getAllReview)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

export default reviewRouter;
