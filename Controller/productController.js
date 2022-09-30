import Product from '../model/productModel.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from './handlerFactory.js';

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

export const getAllProducts = factory.getAll(Product);

export const getProduct = factory.getOne(Product, { path: 'reviews' });

export const createProduct = factory.createOne(Product);
export const updateProduct = factory.updateOne(Product);
export const deleteProduct = factory.deleteOne(Product);
