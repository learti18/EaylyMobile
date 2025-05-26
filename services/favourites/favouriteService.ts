import api from "../auth/api";

export const getFavourites = async () => {
    try {
        const response = await api.get("/favorite-foods");

        if (response.status !== 200) {
            throw new Error("Failed to fetch favourites");
        }

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const addToFavourites = async (foodId: number) => {
    try {
        const response = await api.post("/favorite-foods", { foodId });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const removeFromFavourites = async (foodId: number) => {
    try {
        const response = await api.delete(`/favorite-foods/${foodId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getFavouriteRestaurantId = async (
    favouriteId: number
): Promise<Food[]> => {
    try {
        const response = await api.get(`/favourites/${favouriteId}/foods`);

        if (response.status !== 200) {
            // @ts-ignore
            throw new Error("Failed to fetch favourite foods", response.statusText);
        }

        const data = await response.data;
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};