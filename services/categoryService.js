export const categoryFilter = req => {
  let filter;
  if (req.query.keywords)
    filter = {
      ...filter,
      $or: [{ name: { $regex: new RegExp(req.query.keywords, 'i') } }],
    };

  return filter;
};
