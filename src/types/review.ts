export interface IReview {
  id: number;
  userName: string;
  userId: number;
  date: number;
  rating: number;
  comment: string;
  productId: number;
  productName: string;
  productImage: string;
  isModerate: boolean;
}
