import api from '@/api';
import type { IProduct } from '@/types/product';

export const addProduct = async (product: IProduct) => await api.post('products', product);

export const removeProduct = async (id: number) => await api.delete(`products/${id}`);

export const addEditingProduct = async (product: IProduct) => await api.patch(`products/${product.id}`, product);
