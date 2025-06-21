export const getOrderStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "preparing":
      return "bg-blue-100 text-blue-700";
    case "ready":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getPaymentStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "failed":
      return "bg-red-100 text-red-700";
    case "refunded":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
