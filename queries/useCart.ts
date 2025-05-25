import api from "@/services/auth/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useFetchCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await api.get("/cart");

      return response.data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cartData: { foodId: number; quantity: number }) => {
      const { data } = await api.post("/cart/items", cartData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      Toast.show({
        type: "success",
        text1: "Item added to basket",
      });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await api.delete("/cart");
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["cart"], { cartItems: [], totalPrice: 0 });

      queryClient.invalidateQueries({ queryKey: ["cart"] });
      Toast.show({
        type: "success",
        text1: "Basket cleared successfully!",
      });
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Failed to clear basket",
        text2: error.message || "An error occurred while clearing the basket.",
      });
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (foodId: number) => {
      const response = await api.delete(`/cart/items/${foodId}`);
      return response.data;
    },
    onSuccess: (data, foodId) => {
      queryClient.setQueryData(["cart"], (oldData: any) => {
        if (!oldData) return oldData;

        const updatedCartItems = oldData.cartItems.filter(
          (item: any) => item.id !== foodId
        );

        const totalPrice = updatedCartItems.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0
        );

        return {
          ...oldData,
          cartItems: updatedCartItems,
          totalPrice,
        };
      });
      Toast.show({
        type: "delete",
        text1: "Item removed from basket",
      });

      queryClient.invalidateQueries({ queryKey: ["cart"] });
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

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cartData: { foodId: number; quantity: number }) => {
      const response = await api.put(`/cart/items/${cartData.foodId}`, {
        quantity: cartData.quantity,
      });
      return response.data;
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Failed to update basket",
        text2: error.message || "An error occurred while updating the basket.",
      });
    },
    onMutate: async (cartData) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCartData = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (oldData: any) => {
        if (!oldData) return oldData;

        const updatedCartItems = oldData.cartItems.map((item: any) =>
          item.id === cartData.foodId
            ? { ...item, quantity: cartData.quantity }
            : item
        );

        const totalPrice = updatedCartItems.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0
        );

        return {
          ...oldData,
          cartItems: updatedCartItems,
          totalPrice,
        };
      });

      return { previousCartData };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
