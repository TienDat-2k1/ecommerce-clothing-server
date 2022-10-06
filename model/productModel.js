import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
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
      type: String,
      required: [true, 'A product must have a material!'],
    },
    sizes: {
      type: [String],
      validate: {
        validator: s => Array.isArray(s) && v.length > 0,
        message: 'Not an array or array empty',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 1.0'],
      set: val => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categories',
      required: [true, 'A product must have a category'],
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
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

productSchema.index({ price: 1, ratingsAverage: -1, saleOff: -1, sold: -1 });

productSchema.virtual('reviews', {
  ref: 'review',
  foreignField: 'product',
  localField: '_id',
});

const Product = mongoose.model('product', productSchema);

export default Product;
