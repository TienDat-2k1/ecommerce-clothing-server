import Order from '../model/orderModel.js';

import * as factory from './handlerFactory.js';
import * as orderServices from '../services/orderServices.js';
import catchAsync from '../utils/catchAsync.js';

export const orderStart = catchAsync(async (req, res, next) => {
  const totalRevenue = await Order.aggregate([
    {
      $match: { status: 'Success' },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
        num: { $sum: 1 },
      },
    },
  ]);

  const totalOrderCancel = await Order.aggregate([
    {
      $match: { status: 'Cancelled' },
    },
    {
      $group: {
        _id: null,
        num: { $sum: 1 },
      },
    },
  ]);

  const totalOrder = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrder: { $sum: 1 },
      },
    },
  ]);

  const rateSuccess = totalRevenue[0].num / totalOrder[0].totalOrder;
  const rateFailed = totalOrderCancel[0].num / totalOrder[0].totalOrder;

  res.status(200).json({
    status: 'success',
    data: {
      totalRevenue: totalRevenue[0].totalRevenue,
      totalOrder: totalOrder[0].totalOrder,
      rateSuccess: {
        rate: rateSuccess,
        num: totalRevenue[0].num,
      },
      rateFailed: {
        rate: rateFailed,
        num: totalOrderCancel[0].num,
      },
    },
  });
});

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
