import express from 'express';
import {
  aliasTopSale,
  aliasNewArrival,
  createProduct,
  getAllProducts,
  getProduct,
  aliasTopTrending,
  aliasTopHop,
} from '../Controller/productController.js';

import { protect } from '../Controller/authController.js';

const router = express.Router();

// alias route
router.route('/top-hot').get(aliasTopHop, getAllProducts);
router.route('/top-sale').get(aliasTopSale, getAllProducts);
router.route('/top-arrival').get(aliasNewArrival, getAllProducts);
router.route('/top-trending').get(aliasTopTrending, getAllProducts);

//route
router.route('/').get(protect, getAllProducts).post(createProduct);

router.route('/:id').get(getProduct);

export default router;
