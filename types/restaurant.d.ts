interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  imageUrl: string;
  isVerified: boolean;
  category: string;
}

type Category = {
  id: number;
  name: string;
};

interface CategoryButtonProps {
  onPress?: () => void;
  category: Category;
  className?: string;
  isActive?: boolean;
}

interface Food {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  averagePreparationTime: number;
  type: string;
  isFavorite: boolean;
  ingridients: Ingridient[];
}
interface Ingridient {
  id: number;
  name: string;
}
