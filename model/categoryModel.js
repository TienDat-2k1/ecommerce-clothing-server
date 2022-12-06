import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A category must have a name'],
      unique: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A category must have a image cover'],
    },
    // createAt: {
    //   type: Date,
    //   default: new Date().getTime(),
    //   select: false,
    // },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('category', categorySchema);

export default Category;
