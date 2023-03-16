import api from '@/api';
import type { IProduct } from '@/types/product';
import type { ICategory } from '@/types/category';
import type { IColor } from '@/types/color';
import type { IPrices } from '@/types/prices';
import type { IBadge } from '@/types/badge';
import type { IReview } from '@/types/review';
import type { IResponseList } from '@/types/';

import { getResponsePagination } from '@/api/helpers';
import { clearObjectEmptyFields } from '@/helpers';

export const fetchAllProducts = async (params = {}): Promise<IResponseList<IProduct>> => {
  const { data, headers } = await api.get('products', { params: clearObjectEmptyFields(params) });
  return { data, pagination: getResponsePagination(headers) };
};

export const fetchAllCategories = async (): Promise<ICategory[]> => (await api.get('categories')).data;

export const fetchAllColors = async (): Promise<IColor[]> => (await api.get('colors')).data;

export const fetchAllPrices = async (): Promise<IPrices> => (await api.get('prices')).data;

export const fetchAllBadges = async (): Promise<IBadge[]> => (await api.get('badges')).data;

export const fetchProductById = async (id: number): Promise<IProduct> => (await api.get(`products/${id}`)).data;

export const fetchRelatedProducts = async (params = {}): Promise<IProduct[]> =>
  (await api.get('products', { params: params })).data;

export const fetchReviewsById = async (productId: number): Promise<IReview[]> =>
  (await api.get(`reviews?productId=${productId}`)).data;

export const addReview = async (review: IReview) => await api.post('reviews', review);
