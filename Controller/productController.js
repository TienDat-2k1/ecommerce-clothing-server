import Product from '../model/productModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const aliasTopHop = catchAsync(async (req, res, next) => {
  req.query.limit = '8';
  req.query.sort = '-rating';

  next();
});

export const aliasTopSale = catchAsync(async (req, res, next) => {
  req.query.limit = '8';
  req.query.sort = '-saleOff';

  next();
});

export const aliasNewArrival = catchAsync(async (req, res, next) => {
  req.query.limit = '8';
  req.query.sort = '-createAt';

  next();
});

export const aliasTopTrending = catchAsync((req, res, next) => {
  req.query.limit = '8';
  req.query.sort = '-numberReview';

  next();
});

export const getAllProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const products = await features.query;

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});
export const createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct,
    },
  });
});

export const getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new AppError('No product found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});
