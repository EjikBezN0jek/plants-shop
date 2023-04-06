import type { IColor } from '@/types/color';
export interface IProduct {
  id: number;
  name: string;
  price: number;
  colors: IColor[];
  categories: string[];
  rating: number;
  badges: string[];
  description: string;
  img: string;
}
