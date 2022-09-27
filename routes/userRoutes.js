import express from 'express';
import { login, signup } from '../Controller/authController.js';

const userRoute = express.Router();

// alias route

userRoute.post('/signup', signup);
userRoute.post('/login', login);

// routes
// userRoute.route('/').get(getAllUsers).post(createUser);

// userRoute.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default userRoute;
