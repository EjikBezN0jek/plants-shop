import api from '@/api';
import type { IPaymentItem } from '@/types/paymentItem';
import type { ICountry } from '@/types/country';
import type { IOrder } from '@/types/order';
import type { IUser } from '@/types/user';

export const fetchPaymentItems = async (): Promise<IPaymentItem[]> => (await api.get('payment')).data;

export const fetchCountries = async (): Promise<ICountry[]> => (await api.get('countries')).data;

export const addOrder = async (order: IOrder, user: IUser) => {
  await api.post('orders', order);
  api.patch(`users/${user.id}`, user);
};
