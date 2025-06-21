export interface CartItem {
  id: number;
  foodName: string;
  foodImageUrl?: string;
  quantity: number;
  price: number;
}

export interface Cart {
  id: number;
  cartItems: CartItem[];
  totalPrice: number;
}
