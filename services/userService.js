export const filterObj = (obj, ...allowFields) => {
  let newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

export const userFilter = req => {
  let filter = {};

  if (req.query.key)
    filter = {
      ...filter,
      $or: [{ email: { $regex: new RegExp(req.query.key, 'i') } }],
    };

  return filter;
};
