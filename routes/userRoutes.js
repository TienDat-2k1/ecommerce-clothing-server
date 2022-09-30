import express, { Router } from 'express';
import * as authController from '../Controller/authController.js';
import * as userController from '../Controller/userController.js';
import orderRouter from './orderRoutes.js';

const userRoute = express.Router();

userRoute.post('/signup', authController.signup);
userRoute.post('/login', authController.login);
userRoute.post('/forgotPassword', authController.forgotPassword);
userRoute.patch('/resetPassword/:token', authController.resetPassword);

// protect all routes after this
userRoute.use(authController.protect);

userRoute.patch('/updatePassword', authController.updatePassword);

userRoute.get('/me', userController.getMe, userController.getUser);

userRoute.patch('/updateMe', userController.updateMe);
userRoute.patch('/deleteMe', userController.deleteMe);

// protect all route permission admin after this
userRoute.use(authController.restrictTo('admin'));

// don't use middleware => do not update password
userRoute
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default userRoute;
