import express from 'express';
import { signup } from '../Controller/authController.js';

const userRoute = express.Router();

// alias route

userRoute.post('/signup', signup);

// routes
// userRoute.route('/').get(getAllUsers).post(createUser);

// userRoute.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRoute;
