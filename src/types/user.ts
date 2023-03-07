import type { IOrder } from '@/types/order';

export interface IUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  orders: IOrder[];
}
