import axios from "axios";

/**
 * The baseURL points to your Node.js server.
 * It uses the environment variable if available, otherwise defaults to port 3001.
 *
 */
const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

/**
 * Request Interceptor:
 * Automatically attaches the 'sessionToken' from localStorage to the Authorization header.
 *
 */
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('sessionToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error retrieving token from localStorage", error);
  }

  if (import.meta.env.MODE === 'development') {
    console.log(`API request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * Response Interceptor:
 * Handles global errors and logs responses during development.
 *
 */
api.interceptors.response.use((response) => {
  if (import.meta.env.MODE === 'development') {
    console.log(`API response: ${response.status} ${response.config?.url}`, response.data);
  }
  return response;
}, (error) => {
  if (import.meta.env.MODE === 'development') {
    console.error('API error', error?.response?.status, error?.config?.url, error?.message);
  }
  
  // Handle 401 Unauthorized (Expired session)
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('sessionToken');
    // Optional: window.location.href = "/login";
  }
  
  return Promise.reject(error);
});

export default api;
