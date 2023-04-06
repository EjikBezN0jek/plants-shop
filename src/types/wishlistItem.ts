import type { IColor } from '@/types/color';

export interface IWishlistItem {
  wishlistId: string;
  id: number;
  name: string;
  price: number;
  color: IColor;
  img: string;
}
