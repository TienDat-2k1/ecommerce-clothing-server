import express from 'express';
import * as productController from '../Controller/productController.js';
import * as authController from '../Controller/authController.js';
import * as reviewController from '../Controller/reviewController.js';
import reviewRouter from './reviewRoutes.js';

const router = express.Router();

//router
//   .route('/:productId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

router.use('/:productId/reviews', reviewRouter);

// alias route
router
  .route('/top-hot')
  .get(productController.aliasTopHop, productController.getAllProducts);
router
  .route('/top-sale')
  .get(productController.aliasTopSale, productController.getAllProducts);
router
  .route('/top-arrival')
  .get(productController.aliasNewArrival, productController.getAllProducts);
router
  .route('/top-trending')
  .get(productController.aliasTopTrending, productController.getAllProducts);

//route
router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo('user'),
    productController.deleteProduct
  );

export default router;
