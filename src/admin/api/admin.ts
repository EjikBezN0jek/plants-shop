import api from '@/api';
import type { IProduct } from '@/types/product';
import type { IResponseList } from '@/types/';

import { getResponsePagination } from '@/api/helpers';

export const fetchAllProducts = async (): Promise<IResponseList<IProduct>> => {
  const { data, headers } = await api.get('products');
  return { data, pagination: getResponsePagination(headers) };
};
