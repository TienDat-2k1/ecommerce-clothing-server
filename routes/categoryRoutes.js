import express from 'express';
import * as categoryController from '../Controller/categoryController.js';

import * as authController from '../Controller/authController.js';

const collectionRoute = express.Router();

// alias route

// routes
collectionRoute
  .route('/')
  .get(categoryController.getAllCategories)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.uploadCategoryCoverPhoto,
    categoryController.resizeImageCover,
    categoryController.createCategory
  );

collectionRoute
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.uploadCategoryCoverPhoto,
    categoryController.resizeImageCover,
    categoryController.updateCategory
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.deleteCategory
  );

export default collectionRoute;
