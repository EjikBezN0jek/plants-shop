import api from '@/api';
import type { IProduct } from '@/types/product';
import type { IResponseList } from '@/types/';

// import { getResponsePagination } from '@/api/helpers';

// export const fetchAllProducts = async (): Promise<IResponseList<IProduct>> => {
//   const { data, headers } = await api.get('products');
//   return { data, pagination: getResponsePagination(headers) };
// };
export const addProduct = async (product: IProduct) => await api.post('products', product);

export const removeProduct = async (id: number) => await api.delete(`products/${id}`);
