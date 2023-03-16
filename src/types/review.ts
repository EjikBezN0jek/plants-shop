export interface IReview {
  id: number;
  userName: string;
  date: number;
  rating: number;
  comment: string;
  productId: number;
  isModerate: boolean;
}
