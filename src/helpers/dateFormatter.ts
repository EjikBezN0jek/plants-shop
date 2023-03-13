/* eslint-disable */
// @ts-nocheck

export const dateFormatter = (date: number) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(date).toLocaleString('en-US', options);
};
