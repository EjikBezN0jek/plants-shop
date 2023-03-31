import api from '@/api';
import type { IProduct } from '@/types/product';
import type { IReview } from '@/types/review';
import type { IResponseList } from '@/types/';

import { getResponsePagination } from '@/api/helpers';
import { clearObjectEmptyFields } from '@/helpers';

export const addProduct = async (product: IProduct) => await api.post('products', product);

export const removeProduct = async (id: number) => await api.delete(`products/${id}`);

export const addEditingProduct = async (product: IProduct) => await api.patch(`products/${product.id}`, product);

export const fetchAllReviews = async (params = {}): Promise<IResponseList<IReview>> => {
  const { data, headers } = await api.get('reviews', { params: clearObjectEmptyFields(params) });
  return { data, pagination: getResponsePagination(headers) };
};

export const addModeratingReview = async (review: IReview) => await api.patch(`reviews/${review.id}`, review);

export const changeRating = async (id: number, product: IProduct) => await api.patch(`products/${id}`, product);

// export const cancelModerating = async (review: IReview) => await api.patch(`reviews/${review.id}`, review);
export const removeReview = async (id: number) => await api.delete(`reviews/${id}`);
