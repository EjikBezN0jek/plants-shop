import type { IProduct } from '@/types/product';

// I
export interface IFetchResult {
  [index: number]: IProduct[] & number;
}
