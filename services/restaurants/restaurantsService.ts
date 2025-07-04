import api from "../auth/api";

interface RestaurantResponse {
  items: Restaurant[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const getRestaurants = async (): Promise<RestaurantResponse> => {
  try {
    const response = await api.get("/restaurants");

    if (response.status !== 200) {
      // @ts-ignore
      throw new Error("Failed to fetch restaurants", response.statusText);
    }

    const data = await response.data;
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getFoodsByRestaurantId = async (
  restaurantId: number
): Promise<Food[]> => {
  try {
    const response = await api.get(`/restaurants/${restaurantId}/foods`);

    if (response.status !== 200) {
      // @ts-ignore
      throw new Error("Failed to fetch foods", response.statusText);
    }

    const data = await response.data;
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getRestaurantCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get("/restaurants/categories");

    if (response.status !== 200) {
      // @ts-ignore
      throw new Error(
        "Failed to fetch restaurant categories",
        response.statusText
      );
    }
    const data = await response.data;
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
