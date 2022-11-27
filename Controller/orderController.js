import Order from '../model/orderModel.js';

import * as factory from './handlerFactory.js';
import * as orderServices from '../services/orderServices.js';
import catchAsync from '../utils/catchAsync.js';

export const getAllOrder = factory.getAll(Order, orderServices.orderFilter);
export const createOrder = factory.createOne(Order);
export const getOrder = factory.getOne(Order);
export const updateOrder = factory.updateOne(Order);
// export const deleteOrder = factory.deleteOne(Order);
