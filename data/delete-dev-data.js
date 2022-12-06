import Category from '../model/categoryModel.js';
import Order from '../model/orderModel.js';
import Product from '../model/productModel.js';
import Review from '../model/reviewModel.js';
import User from '../model/userModel.js';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('DB connection successful'));

// read json file
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`),
  'utf-8'
);
const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/categories.json`),
  'utf-8'
);

//import data
const importData = async () => {
  try {
    await Product.create(products);
    await Category.create(categories);
  } catch (e) {
    console.log(e);
  }

  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    // await User.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();
    await Category.deleteMany();
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--delete') {
  deleteData();
}
if (process.argv[2] === '--import') {
  importData();
}
