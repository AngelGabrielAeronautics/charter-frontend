// /src/config/axiosInstance.ts
import axios from "axios";

import { store } from "@/lib/state/store";

// Import the Redux store

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // You can set the base URL from environment variables
});

// Add a request interceptor to include the user ID and display name in headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Access the auth state from the Redux store
    const { auth } = store.getState();
    const { authenticatedUser } = auth;

    // Modify the config to include the audit log headers
    if (
      authenticatedUser &&
      authenticatedUser._id &&
      authenticatedUser.displayName
    ) {
      config.headers["ADI"] = btoa(authenticatedUser._id);
      config.headers["ADN"] = btoa(authenticatedUser.displayName);
    }

    return config;
  },
  (error) => {
    // Handle error
    return Promise.reject(error);
  }
);

export default axiosInstance;
