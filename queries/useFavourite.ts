import { addToFavourites, getFavourites, removeFromFavourites } from "@/services/favourites/favouriteService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useFetchFavourites = () => {
  return useQuery({
    queryKey: ["favourites"],
    queryFn: async () => {
      const response = await getFavourites();

      return response;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};

export const useAddToFavourite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (foodId: number) => {
      const { data } = await addToFavourites(foodId);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      Toast.show({
        type: "success",
        text1: "Item added to favourites",
      });
    },
  });
};

export const useClearFavourites = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (foodId: number) => {
      const response = await removeFromFavourites(foodId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["favourites"], { favouriteItems: [], totalPrice: 0 });

      queryClient.invalidateQueries({ queryKey: ["favourites"] });
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      Toast.show({
        type: "success",
        text1: "Favourites cleared successfully!",
      });
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Failed to clear favourites",
        text2: error.message || "An error occurred while clearing the favourites.",
      });
    },
  });
};

export const useRemoveFavouriteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (foodId: number) => {
      const response = await removeFromFavourites(foodId);
      return response.data;
    },
    onSuccess: (data, foodId) => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      Toast.show({
        type: "delete",
        text1: "Item removed from favourites",
      });
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Failed to remove item",
        text2: error.message || "An error occurred while removing the item",
      });
    },
  });
};