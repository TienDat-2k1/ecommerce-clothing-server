import express, { Router } from 'express';
import * as authController from '../Controller/authController.js';
import * as userController from '../Controller/userController.js';

const userRoute = express.Router();

// alias route

userRoute.post('/signup', authController.signup);
userRoute.post('/login', authController.login);

userRoute.post('/forgotPassword', authController.forgotPassword);
userRoute.patch('/resetPassword/:token', authController.resetPassword);

userRoute.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

userRoute.patch('/updateMe', authController.protect, userController.updateMe);
userRoute.patch('/deleteMe', authController.protect, userController.deleteMe);

// routes
// userRoute.route('/').get(getAllUsers).post(createUser);

// userRoute.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRoute;
