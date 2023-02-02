/* eslint-disable */

export const debounce = (fn: Function, delay = 0) => {
  let timeoutId: number;

  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
