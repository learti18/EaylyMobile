import { getRestaurantCategories } from "@/services/restaurants/restaurantsService";
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