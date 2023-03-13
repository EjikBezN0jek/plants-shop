import { IOrderStatus } from '@/types/orderStatus';
import type { ICartItem } from '@/types/cartItem';
import type { IPaymentItem } from '@/types/paymentItem';
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
  payment: IPaymentItem;
  totalCost: number;
  status: IOrderStatus;
  cart: ICartItem[];
  userId: number;
  shippingCost: number;
  productsTotal: number;
}
