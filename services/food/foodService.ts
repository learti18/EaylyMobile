import api from "../auth/api";

export const getFoodById = async (
    foodId: number,
    restaurantId: number
  ): Promise<Food> => {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/foods/${foodId}`);
  
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