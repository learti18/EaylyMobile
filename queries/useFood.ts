import { getFoodById } from "@/services/food/foodService";
import { useQuery } from "@tanstack/react-query";

export const useGetFoodById = (foodId: number, restaurantId: number) => {
    return useQuery({
        queryKey: ["foodById", foodId, restaurantId],
        queryFn: async () => {
            const response = await getFoodById(foodId, restaurantId);
            return response;
        }
    });
};