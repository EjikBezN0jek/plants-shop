export const clearObjectEmptyFields = (obj: { [n: string]: string | string[] | number }) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null && v != undefined && v != ''));
};

export const createPagination = () => ({
  current: 1,
  last: 1,
  items: 1,
});
