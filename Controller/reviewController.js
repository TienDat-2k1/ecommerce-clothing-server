import Review from '../model/reviewModel.js';
import * as factory from './handlerFactory.js';

export const setProductReviewIds = (req, res, next) => {
  // allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

export const getAllReview = factory.getAll(Review);
export const getReview = factory.getOne(Review);
export const createReview = factory.createOne(Review);
export const updateReview = factory.updateOne(Review);
export const deleteReview = factory.deleteOne(Review);
