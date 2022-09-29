import express from 'express';
import * as reviewController from '../Controller/reviewController.js';
import * as authController from '../Controller/authController.js';

const reviewRouter = express.Router({ mergeParams: true });

// mergeParams:
// POST /products/id/reviews
// POST /reviews

reviewRouter
  .route('/')
  .get(reviewController.getAllReview)
  .post(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    reviewController.setProductReviewIds,
    reviewController.createReview
  );

reviewRouter
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authController.protect, reviewController.updateReview)
  .delete(authController.protect, reviewController.deleteReview);

export default reviewRouter;
