import axios from "axios";
import env from "@/config/env";
import { store } from "@/app/store";
import { logout, setCredentials } from "@/store/slices/authSlice";
import { tokenService } from "@/services/token.service";

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
  withCredentials: true,
});

export const publicClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (!status) {
      return Promise.reject({
        ...error,
        message: "Network error. Please check your connection and try again.",
      });
    }

    if (status === 403) {
      return Promise.reject({
        ...error,
        message: "You do not have permission to perform this action.",
      });
    }

    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/user/refresh-token")) {
      tokenService.clearAccessToken();
      store.dispatch(logout());
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const response = await publicClient.post("/user/refresh-token");
      const accessToken = response.data?.access_token || "";
      const currentUser = store.getState().auth.user;

      tokenService.setAccessToken(accessToken);
      store.dispatch(setCredentials({ accessToken, user: currentUser }));
      onRefreshed(accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      tokenService.clearAccessToken();
      store.dispatch(logout());
      return Promise.reject({
        ...refreshError,
        message: "Your session has expired. Please sign in again.",
      });
    } finally {
      isRefreshing = false;
    }
  }
);
