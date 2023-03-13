import api from '@/api';
import type { IOrder } from '@/types/order';
import type { IUser } from '@/types/user';

export const registerUser = async (user = {}) => await api.post('register', user);

export const loginUser = async (user = {}) => await api.post('login', user);

export const fetchUserOrders = async (user: IUser): Promise<IOrder[]> =>
  (await api.get(`orders?userId=${user.id}`)).data;

export const fetchOrderById = async (id: number): Promise<IOrder> => (await api.get(`orders/${id}`)).data;
