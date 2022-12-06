import multer from 'multer';
import sharp from 'sharp';
import crypto from 'crypto';

import Product from '../model/productModel.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from './handlerFactory.js';
import * as productServices from '../services/productServices.js';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadProductImages = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 8,
  },
]);

export const resizeProductImages = async (req, res, next) => {
  if (!req.files?.imageCover && !req.files?.images) return next();

  // 1) Cover image
  if (req.files.imageCover) {
    req.body.imageCover = `product-${
      req.params.id ? req.params.id : crypto.randomBytes(16).toString('hex')
    }-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2048, 2048)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/products/${req.body.imageCover}`);
  }

  // 2) images
  if (req.files.images) {
    if (!req.body.images) req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `product-${
          req.params.id ? req.params.id : crypto.randomBytes(16).toString('hex')
        }-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(2048, 2048)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/products/${filename}`);

        req.body.images.push(filename);
      })
    );
  }

  next();
};

export const aliasTopHop = catchAsync(async (req, res, next) => {
  req.query.limit = '100';
  req.query.sort = '-ratingsAverage';
  next();
});

export const aliasTopSale = catchAsync(async (req, res, next) => {
  req.query.limit = '100';
  req.query.sort = '-saleOff';
  next();
});

export const aliasNewArrival = catchAsync(async (req, res, next) => {
  req.query.limit = '100';
  req.query.sort = '-createdAt';
  next();
});

export const aliasTopTrending = catchAsync(async (req, res, next) => {
  req.query.limit = '100';
  req.query.sort = '-ratingsQuantity';
  next();
});

// { $all: req.query.sizes.split(',') }

export const getAllProducts = factory.getAll(
  Product,
  productServices.productFilter
);

export const getProduct = factory.getOne(Product, { path: 'reviews' });

export const createProduct = factory.createOne(Product);
export const updateProduct = factory.updateOne(Product);
export const deleteProduct = factory.deleteOne(Product);
