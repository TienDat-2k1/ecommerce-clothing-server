export const productFilter = req => {
  let filter = {};
  // To allow for nested GET reviews on tour (hack)
  if (req.params.productId) filter.product = req.params.productId;
  if (req.query.keywords)
    filter = {
      ...filter,
      $or: [{ name: { $regex: new RegExp(req.query.keywords, 'i') } }],
    };
  if (req.query.size) filter.sizes = { $all: req.query.size.split(',') };

  return filter;
};
