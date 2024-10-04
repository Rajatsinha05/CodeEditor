import axios from "axios";
import Cookies from "js-cookie";

// Define URLs for different environments
const LOCAL_URL = "http://localhost:8090";
const PRODUCTION_URL =
  "https://dry-owls-clap.loca.lt";

// Set the base URL to production for now
const axiosInstance = axios.create({
  baseURL: PRODUCTION_URL,
});

// Add a request interceptor to attach the token to all requests except login and signup
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    const isAuthRequest =
      config.url.includes("/users/login") ||
      config.url.includes("/users/signup");

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
