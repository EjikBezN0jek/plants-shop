import type { IOrder } from '@/types/order';

export interface IUser {
  email: string;
  password: string;
  orders: IOrder[];
}
