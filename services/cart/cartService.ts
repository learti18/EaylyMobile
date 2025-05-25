import api from "../auth/api";

export const getCart = async () => {
  try {
    const response = await api.get("/cart");

    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addToCart = async (foodId: number, quantity: number) => {
  try {
    const response = await api.post("/cart/items", { foodId, quantity });

    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await api.delete("/cart");

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
