export const orderFilter = req => {
  let filter = {};

  if (req.query.key)
    filter = {
      ...filter,
      $or: [{ phone: { $eq: req.query.key } }],
    };

  return filter;
};
