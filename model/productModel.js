import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name!'],
    unique: true,
    minLength: 1,
    maxLength: 200,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A product must have a image cover!'],
  },
  images: [String],
  price: {
    type: Number,
    required: [true, 'A product must have a price!'],
  },
  material: {
    type: [String],
    required: [true, 'A product must have a material!'],
  },
  sizes: {
    type: [String],
    required: [true, 'A product must have a size!'],
  },
  rating: {
    type: Number,
    default: 0,
  },
  numberReview: { type: Number, default: 0 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
  },
  saleOff: {
    type: Number,
    default: 0,
  },
  createAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  description: {
    type: String,
    required: [true, 'A product must have a description'],
    trim: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model('product', productSchema);

export default Product;
