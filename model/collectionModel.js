import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A collection must have a name'],
    unique: true,
  },
  imageCover: {
    type: String,
    require: [true, 'A collection must have a image cover'],
  },
  createAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Collection = mongoose.model('Collections', collectionSchema);

export default Collection;
