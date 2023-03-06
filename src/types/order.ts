import type { ICartItem } from '@/types/cartItem';

export interface IOrder {
  id: number;
  date: number;
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  payment: string;
  totalCost: number;
  status: string;
  cart: ICartItem[];
}
