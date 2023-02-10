import type { IProduct } from '@/types/product';

export interface IFetchResult {
  [index: number]: IProduct[] & number;
}
