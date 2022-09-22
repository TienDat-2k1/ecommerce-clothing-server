import Collection from '../model/collectionModel.js';
import catchAsync from '../utils/catchAsync.js';

export const getAllCollection = catchAsync(async (req, res, next) => {
  const collections = await Collection.find();

  res.status(200).json({
    status: 'success',
    results: collections.length,
    data: {
      collections,
    },
  });
});

export const createCollection = catchAsync(async (req, res, next) => {
  const newCollection = await Collection.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      collection: newCollection,
    },
  });
});
