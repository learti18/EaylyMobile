import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BASE_URL}:5015/api/`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
