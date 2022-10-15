export const reviewFilter = req => {
  let filter = {};

  if (req.params.productId)
    filter = { ...filter, product: req.params.productId };

  return filter;
};
