import api from "@/services/auth/api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useFetchOrderById = (orderId: string) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const response = await api.get(`/orders/user/${orderId}`);
      return response.data;
    },
  });
};
export const useInfiniteOrders = (filters: {
  orderStatus?: string;
  paymentStatus?: string;
  pageSize?: number;
}) => {
  return useInfiniteQuery({
    queryKey: ["orders", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const { orderStatus, paymentStatus, pageSize = 5 } = filters;

      let queryParams = `pageNumber=${pageParam}&pageSize=${pageSize}`;
      if (orderStatus) queryParams += `&orderStatus=${orderStatus}`;
      if (paymentStatus) queryParams += `&paymentStatus=${paymentStatus}`;

      const response = await api.get(`/orders?${queryParams}`);
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.items?.length === filters.pageSize;
      return hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
