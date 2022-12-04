import Category from '../model/categoryModel.js';
import Order from '../model/orderModel.js';
import Product from '../model/productModel.js';
import Review from '../model/reviewModel.js';
import User from '../model/userModel.js';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('DB connection successful'));

const deleteData = async () => {
  try {
    await Product.deleteMany();
    // await User.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();
    await Category.deleteMany();
  } catch (err) {
    console.log(error);
  }
};

if (process.argv[2] === '--delete') {
  deleteData();
}
