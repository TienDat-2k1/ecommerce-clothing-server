import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';

export const deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return new AppError('No document found with that ID', 404);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

export const updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const getAll = (
  Model,
  filterFn = function () {
    return {};
  }
) =>
  catchAsync(async (req, res, next) => {
    const filter = filterFn(req);

    let totalPages = 1;
    const limit = req.query.limit;

    // get all doc before paginate
    if (limit) {
      const totalDoc = await new APIFeatures(
        Model.find({
          ...filter,
        }),
        req.query
      )
        .filter()
        .sort()
        .limitFields().query;

      totalPages = Math.ceil(totalDoc.length / limit);
    }

    // filter with search keywords match with name
    const features = new APIFeatures(
      Model.find({
        ...filter,
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      totalPages,
      data: {
        data: doc,
      },
    });
  });
