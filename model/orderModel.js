import mongoose from 'mongoose';
import AppError from '../utils/appError.js';
import Product from './productModel.js';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
  },
  size: {
    type: String,
    enum: ['S', 'M', 'L', 'XL', 'XXL', 'XXL'],
    required: 'must have size',
  },
  price: {
    type: Number,
    min: 0,
  },
  quantity: {
    type: Number,
    required: [true, 'must have quantity!!'],
    min: [1, 'need least 1'],
  },
});

const orderSchema = mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        'Receive order',
        'Confirm',
        'Shipping',
        'Success',
        'Cancelled',
        'Return',
      ],
      default: 'Receive order',
    },
    items: [
      {
        type: orderItemSchema,
      },
    ],
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    shipper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    address: {
      type: String,
      required: [true, 'An order must have a address!'],
      coordinates: [Number],
    },
    phone: {
      type: String,
      required: [true, 'An order must have a phone number!!'],
    },
    totalPrice: Number,
    description: String,
    // createAt: {
    //   type: Date,
    //   default: Date.now(),
    // },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

orderSchema.index({
  items: 1,
  user: 1,
});

orderSchema.index({ phone: 1 });

const updateProductSold = async (items = [], next) => {
  if (!items || items?.length === 0) return;

  const session = await Product.startSession();
  session.startTransaction();
  try {
    await Promise.all(
      items.map(item => {
        return Product.findOneAndUpdate(
          { _id: item.product._id },
          {
            $inc: { sold: item.quantity },
          }
        );
      })
    );
    await session.commitTransaction();
    session.endSession();
    next();
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    next(new AppError('fail update product sold!', 503));
  }
};

orderSchema.pre('findOneAndUpdate', function (next) {
  const data = this.getUpdate();

  if (data.status === 'Success') {
    this.clone()
      .find(this._conditions)
      .then(res => {
        const items = res[0].items;

        updateProductSold(items, next);
      })
      .catch(e => {
        console.log({ e });
        return next(new AppError('No found document!', 404));
      });
  } else next();

  // next();
});

// orderSchema.post(/^findOneAnd/, async function (doc, next) {
//   console.log('update?');
//   console.log(doc);
// });

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items',
    populate: {
      path: 'product',
      select: 'name imageCover',
    },
  })
    .populate({
      path: 'customer',
      select: 'name',
    })
    .populate({
      path: 'shipper',
      select: 'name',
    });
  next();
});

const Order = mongoose.model('order', orderSchema);

// const deleteData = async () => {
//   await Order.deleteMany();
// };

// deleteData();

export default Order;
