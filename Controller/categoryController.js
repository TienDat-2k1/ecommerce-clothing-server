import multer from 'multer';
import sharp from 'sharp';
import crypto from 'crypto';

import Category from '../model/categoryModel.js';
import AppError from '../utils/appError.js';
import * as categoryService from '../services/categoryService.js';
import * as factory from './handlerFactory.js';

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 404), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadCategoryCoverPhoto = upload.single('imageCover');
export const resizeImageCover = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `category-${
    req.params.id ? req.params.id : crypto.randomBytes(16).toString('hex')
  }--${Date.now()}.jpeg`;

  req.body.imageCover = req.file.filename;

  await sharp(req.file.buffer)
    .resize(2048, 2048)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/categories/${req.file.filename}`);

  next();
};

export const getAllCategories = factory.getAll(
  Category,
  categoryService.categoryFilter
);

export const getCategory = factory.getOne(Category);
export const createCategory = factory.createOne(Category);
export const updateCategory = factory.updateOne(Category);
export const deleteCategory = factory.deleteOne(Category);
