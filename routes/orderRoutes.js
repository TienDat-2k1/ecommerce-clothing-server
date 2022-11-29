import express from 'express';

import * as orderController from '../Controller/orderController.js';
import * as authController from '../Controller/authController.js';

const orderRouter = express.Router();

orderRouter.use(authController.protect);

orderRouter
  .route('/')
  .get(orderController.getAllOrder)
  .post(authController.restrictTo('user'), orderController.createOrder);

orderRouter
  .route('/:id')
  .get(orderController.getOrder)
  .patch(authController.restrictTo('admin'), orderController.updateOrder);

orderRouter.route('/:id/cancel').get(orderController.canceledOrder);

export default orderRouter;
