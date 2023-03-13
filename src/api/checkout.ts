import api from '@/api';
import type { IPaymentItem } from '@/types/paymentItem';
import type { ICountry } from '@/types/country';
import type { IOrder } from '@/types/order';

export const fetchPaymentItems = async (): Promise<IPaymentItem[]> => (await api.get('payment')).data;

export const fetchCountries = async (): Promise<ICountry[]> => (await api.get('countries')).data;

export const addOrder = async (order: IOrder) => await api.post('orders', order);
