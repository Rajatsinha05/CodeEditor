import axios from "axios";
import Cookies from "js-cookie";

// Determine the environment and set the appropriate base URL
const LOCAL_URL = "http://localhost:8091";
const PRODUCTION_URL = "http://95.216.138.63:8090";

const baseURL =
  window.location.hostname === "localhost" ? LOCAL_URL : PRODUCTION_URL;

console.log("baseURL: ", baseURL, window.location.hostname);

// Create an axios instance with the dynamic baseURL
const axiosInstance = axios.create({
  baseURL:" https://demoapi.rnwmultimedia.com",
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
