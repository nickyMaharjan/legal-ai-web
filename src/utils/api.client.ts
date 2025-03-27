import axios from "axios";
import { API_URL } from "./api.url";

const axiosWithLogin = axios.create({
  baseURL: `${API_URL}`,
  timeout: 3 * 60 * 1000,
  headers: { "Content-Type": "application/json" },
});

axiosWithLogin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosWithLogin };
