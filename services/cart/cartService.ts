import api from "../auth/api";

export const getCart = async () => {
  try {
    const response = await api.get("/cart");

    if (response.status !== 200) {
      // @ts-ignore
      throw new Error("Failed to fetch cart", response.statusText);
    }
    const data = await response.data;
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addToCart = async (foodId: number, quantity: number) => {
  try {
    const response = await api.post("/cart/items", { foodId, quantity });

    if (response.status !== 201) {
      // @ts-ignore
      throw new Error("Failed to add item to cart", response.statusText);
    }
    const data = await response.data;
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
