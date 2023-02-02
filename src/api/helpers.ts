import type { IAxiosResponseHeaders } from '@/types';

export const getResponsePagination = (headers: IAxiosResponseHeaders) => {
  const string = headers.link ?? '';

  const findPageNumber = (string = '', target: string) => {
    if (!string) return 1;

    return Number(
      string
        .split(',')
        .find(str => str.includes(target))
        ?.split('&_')
        .find(str => str.includes('page'))
        ?.split('=')[1]
    );
  };

  const itemsCount = Number(headers['x-total-count']);

  const lastPage = findPageNumber(string, 'last');

  let currentPage = 1;

  const isLastPage = !string.includes('next');
  const isMediumPage = string.includes('prev') && string.includes('next');

  if (isLastPage) currentPage = lastPage;
  if (isMediumPage) currentPage = findPageNumber(string, 'prev') + 1;

  return { last: lastPage, current: currentPage, items: itemsCount };
};
