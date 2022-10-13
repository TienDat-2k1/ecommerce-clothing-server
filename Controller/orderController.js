import Order from '../model/orderModel.js';

import * as factory from './handlerFactory.js';

const orderFilter = req => {
  let filter = {};

  if (req.query.key)
    filter = {
      ...filter,
      $or: [{ phone: { $eq: req.query.key } }],
    };

  return filter;
};

export const getAllOrder = factory.getAll(Order, orderFilter);
export const createOrder = factory.createOne(Order);
export const getOrder = factory.getOne(Order);
export const updateOrder = factory.updateOne(Order);
// export const deleteOrder = factory.deleteOne(Order);
