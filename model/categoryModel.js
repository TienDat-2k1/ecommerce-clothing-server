import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A category must have a name'],
    unique: true,
  },
  imageCover: {
    type: String,
    require: [true, 'A category must have a image cover'],
  },
  createAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Category = mongoose.model('categories', categorySchema);

export default Category;
