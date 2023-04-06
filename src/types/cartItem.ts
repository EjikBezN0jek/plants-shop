import type { IColor } from '@/types/color';

export interface ICartItem {
  cartId: string;
  id: number;
  name: string;
  quantity: number;
  price: number;
  color: IColor;
  img: string;
  totalCost: number;
}
