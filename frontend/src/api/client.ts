import axios from 'axios';
import {ENDPOINTS} from "./endpoints.ts";

let currentAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  currentAccessToken = token;
}

export const getAccessToken = () => currentAccessToken;

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const refreshAccessToken = async () => {
  try {
    const refreshResponse = await axios.post(
      `${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`,
      {},
      { withCredentials: true }
    );
    const newAccessToken = refreshResponse.data.accessToken;
    setAccessToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    setAccessToken(null);
    window.dispatchEvent(new Event('auth-logout'));
    throw error;
  }
};

api.interceptors.request.use(
  (config) => {
    if (currentAccessToken) {
      config.headers.Authorization = `Bearer ${currentAccessToken}`;
    }

    return config
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      originalRequest.url !== ENDPOINTS.AUTH.LOGIN &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
)

export default api;