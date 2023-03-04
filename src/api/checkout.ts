import axios from 'axios';
import type { IPaymentItem } from '@/types/paymentItem';
import type { ICountry } from '@/types/country';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
});

export const fetchPaymentItems = async (): Promise<IPaymentItem[]> => (await axiosInstance.get('payment')).data;

export const fetchCountries = async (): Promise<ICountry[]> => (await axiosInstance.get('countries')).data;

export const addOrder = async (order = {}) => await axiosInstance.post('orders', order);
