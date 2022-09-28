export const filterObj = (obj, ...allowFields) => {
  let newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};
