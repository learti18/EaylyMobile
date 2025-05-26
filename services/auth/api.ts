import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BASE_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
