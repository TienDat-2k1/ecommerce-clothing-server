import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
  status: {
    type: String,
    enum: [
      'Receive order',
      'Pending',
      'Shipped',
      'Cancelled',
      'Declined',
      'Refunded',
    ],
    default: 'Receive order',
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      quantity: Number,
      price: Number,
      size: String,
    },
  ],
  customerId: {
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
  createAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Order = mongoose.model('order', orderSchema);

export default Order;
