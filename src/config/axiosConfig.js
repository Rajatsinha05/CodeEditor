// axiosConfig.js
import axios from "axios";
import Cookies from "js-cookie";

// Create an instance of axios with a base URL
const axiosInstance = axios.create({
  baseURL: "http://localhost:8090", // Set the base URL for all requests
});

// Add a request interceptor to attach the token to all requests except login and signup
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    const isAuthRequest = config.url.includes("/users/login") || config.url.includes("/users/signup");

    if (token && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
