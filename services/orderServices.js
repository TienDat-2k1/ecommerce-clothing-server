export const orderFilter = req => {
  let filter = {};

  if (req.query.key)
    filter = {
      ...filter,
      $or: [{ phone: { $regex: new RegExp(req.query.key, 'i') } }],
    };

  return filter;
};
