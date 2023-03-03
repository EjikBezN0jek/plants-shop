import axios from 'axios';
import type { IProduct } from '@/types/product';
import type { ICategory } from '@/types/category';
import type { IColor } from '@/types/color';
import type { IPrices } from '@/types/prices';
import type { IBadge } from '@/types/badge';
import type { IResponseList } from '@/types/';
import type { IPaymentItem } from '@/types/paymentItem';

import { getResponsePagination } from '@/api/helpers';
import { clearObjectEmptyFields } from '@/helpers';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
});

export const fetchAllProducts = async (params = {}): Promise<IResponseList<IProduct>> => {
  const { data, headers } = await axiosInstance.get('products', { params: clearObjectEmptyFields(params) });
  return { data, pagination: getResponsePagination(headers) };
};

export const fetchAllCategories = async (): Promise<ICategory[]> => (await axiosInstance.get('categories')).data;

export const fetchAllColors = async (): Promise<IColor[]> => (await axiosInstance.get('colors')).data;

export const fetchAllPrices = async (): Promise<IPrices> => (await axiosInstance.get('prices')).data;

export const fetchAllBadges = async (): Promise<IBadge[]> => (await axiosInstance.get('badges')).data;

export const fetchProductById = async (id: number): Promise<IProduct> =>
  (await axiosInstance.get(`products/${id}`)).data;

export const fetchRelatedProducts = async (params = {}): Promise<IProduct[]> =>
  (await axiosInstance.get('products', { params: params })).data;

export const fetchPaymentItems = async (): Promise<IPaymentItem[]> => (await axiosInstance.get('payment')).data;
