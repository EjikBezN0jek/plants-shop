import axios from 'axios';
import type { IProduct } from '@/types/product';
import type { ICategory } from '@/types/category';
import type { IColor } from '@/types/color';
import type { IPrices } from '@/types/prices';
import type { IResponseList } from '@/types/';

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
