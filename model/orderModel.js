import mongoose from 'mongoose';

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

orderSchema.pre('save', function (next) {
  if (this.status === 'Success') {
    // this.sold=+1
    // console.log(this);
  }
  next();
});

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
