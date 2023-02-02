import { ref } from 'vue';

import type { IPagination } from '@/types/';

export const usePagination = () => {
  const pagination = ref<IPagination>({
    current: 1,
    last: 1,
    items: 1,
  });

  const setPagination = (value: IPagination) => {
    pagination.value = value;
  };

  const resetCurrentPage = () => {
    pagination.value.current = 1;
  };

  const setCurrentPage = (page: number) => {
    pagination.value.current = page;
  };

  const isActivePage = (page: number) => {
    pagination.value.current === page;
  };

  return { pagination, setPagination, resetCurrentPage, setCurrentPage, isActivePage };
};
