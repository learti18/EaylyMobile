interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  imageUrl: string;
  averagePreparationTime: number;
  foodType: string;
  isVerified: boolean;
  category: string;
}

interface Category {
  id: number;
  name: string;
}

interface CategoryButtonProps {
  onPress?: () => void;
  category: Category;
  className?: string;
  isActive?: boolean;
}

interface Food {
  calories: ReactNode;
  id: number;
  name: string;
  price: number;
  slogan: string;
  imageUrl: string;
  averagePreparationTime: number;
  type: string;
  isFavorite: boolean;
  ingridients: Ingridient[];
  restaurantId: number;
}

interface Ingridient {
  id: number;
  name: string;
}
