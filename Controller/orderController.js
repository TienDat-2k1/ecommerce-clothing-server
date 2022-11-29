import Order from '../model/orderModel.js';

import * as factory from './handlerFactory.js';
import * as orderServices from '../services/orderServices.js';
import catchAsync from '../utils/catchAsync.js';

export const canceledOrder = catchAsync(async (req, res, next) => {
  const doc = await Order.findByIdAndUpdate(
    req.params.id,
    { status: 'Cancelled' },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!doc) return next(new AppError('No document found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

export const getAllOrder = factory.getAll(Order, orderServices.orderFilter);
export const createOrder = factory.createOne(Order);
export const getOrder = factory.getOne(Order);
export const updateOrder = factory.updateOne(Order);
// export const deleteOrder = factory.deleteOne(Order);
