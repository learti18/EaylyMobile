import api from "@/services/auth/api";
import { useQuery } from "@tanstack/react-query";

export const useFetchOrderById = (orderId: string) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const response = await api.get(`/orders/user/${orderId}`);
      return response.data;
    },
  });
};
export const useFetchOrders = (options = { pageNumber: 1, pageSize: 5 }) => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { pageNumber, pageSize, orderStatus, paymentStatus } = options;

      let queryParams = `pageNumber=${pageNumber}&pageSize=${pageSize}`;
      if (orderStatus) queryParams += `&orderStatus=${orderStatus}`;
      if (paymentStatus) queryParams += `&paymentStatus=${paymentStatus}`;

      const response = await api.get(`/orders?${queryParams}`);
      return response.data;
    },
  });
};
