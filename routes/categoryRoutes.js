import express from 'express';
import {
  createCollection,
  getAllCollection,
} from '../Controller/categoryController.js';

const collectionRoute = express.Router();

// alias route

// routes
collectionRoute.route('/').get(getAllCollection).post(createCollection);

export default collectionRoute;
