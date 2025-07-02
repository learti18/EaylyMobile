import { getFoodsByRestaurantId, getRestaurantCategories } from "@/services/restaurants/restaurantsService";
import { useQuery } from "@tanstack/react-query";

export const useGetRestaurantCategories = () => {
    return useQuery({
        queryKey: ["restaurantCategories"],
        queryFn: async () => {
            const response = await getRestaurantCategories();
            return response;
        }
    });
};

export const useGetFoodsByRestaurantId = (restaurantId: number) => {
    return useQuery({
        queryKey: ["restaurantFoods", restaurantId],
        queryFn: async () => {
            const response = await getFoodsByRestaurantId(restaurantId);
            return response;
        },
        enabled: !!restaurantId,
        refetchOnMount: true,
        staleTime: 0,
    });
};