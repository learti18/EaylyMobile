export const getOrderStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return { backgroundColor: "#dcfce7", color: "#15803d" }; // green
    case "pending":
      return { backgroundColor: "#fef3c7", color: "#d97706" }; // yellow
    case "cancelled":
      return { backgroundColor: "#fecaca", color: "#dc2626" }; // red
    case "preparing":
      return { backgroundColor: "#dbeafe", color: "#2563eb" }; // blue
    case "ready":
      return { backgroundColor: "#e9d5ff", color: "#9333ea" }; // purple
    case "confirmed":
      return { backgroundColor: "#e0f2fe", color: "#0891b2" }; // cyan
    default:
      return { backgroundColor: "#f3f4f6", color: "#374151" }; // gray
  }
};

export const getPaymentStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return { backgroundColor: "#dcfce7", color: "#15803d" }; // green
    case "pending":
      return { backgroundColor: "#fef3c7", color: "#d97706" }; // yellow
    case "failed":
      return { backgroundColor: "#fecaca", color: "#dc2626" }; // red
    case "refunded":
      return { backgroundColor: "#fed7aa", color: "#ea580c" }; // orange
    default:
      return { backgroundColor: "#f3f4f6", color: "#374151" }; // gray
  }
};
