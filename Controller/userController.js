import multer from 'multer';
import sharp from 'sharp';

import User from '../model/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import * as userService from '../services/userService.js';
import * as factory from './handlerFactory.js';

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
export const uploadUserPhoto = upload.single('photo');
export const resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}--${Date.now()}.jpeg`;

  req.body.photo = req.file.filename;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POST password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not for password updates. Please use/updatePassword.'
      )
    );

  // 2) Filtered out unwanted fields names that are not allow to update
  const filteredBody = userService.filterObj(
    req.body,
    'name',
    'email',
    'address',
    'phone'
  );
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document

  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
};

export const getUser = factory.getOne(User, { path: 'orders' });
export const getAllUsers = factory.getAll(User, userService.userFilter);

// DO NOT update passwords with this!
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);
