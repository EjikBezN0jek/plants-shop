/* eslint-disable */
// @ts-nocheck

export const dateFormatter = (date: number) => {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };
  return new Date(date).toLocaleString('ru', options);
};

export const dateFormatterFull = (date: number) => {
  return new Date(date).toLocaleString('ru');
};
