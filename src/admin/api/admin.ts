import api from '@/api';
import type { IProduct } from '@/types/product';
import type { IReview } from '@/types/review';
import type { IOrder } from '@/types/order';
import type { IColor } from '@/types/color';

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

export const removeReview = async (id: number) => await api.delete(`reviews/${id}`);

export const fetchAllOrders = async (params = {}): Promise<IResponseList<IOrder>> => {
  const { data, headers } = await api.get('orders', { params: clearObjectEmptyFields(params) });
  return { data, pagination: getResponsePagination(headers) };
};

export const fetchOrderById = async (id: number): Promise<IOrder> => (await api.get(`orders/${id}`)).data;

export const changeOrderStatus = async (id: number, order: IOrder) => await api.patch(`orders/${id}`, order);

export const addColor = async (color: IColor) => await api.post('colors', color);
