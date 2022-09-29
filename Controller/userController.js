import User from '../model/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import * as userService from '../services/userService.js';
import * as factory from './handlerFactory.js';

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

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
  const filteredBody = userService.filterObj(req.body, 'name', 'email');

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

export const getUser = factory.getOne(User);

// DO NOT update passwords with this!
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);
