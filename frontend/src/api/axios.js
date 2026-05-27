import axios from "axios";
import env from "@/config/env";
import { store } from "@/app/store";
import { logout, setCredentials } from "@/store/slices/authSlice";
import { tokenService } from "@/services/token.service";

const API_TIMEOUT_MS = 15000;
const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";
const REFRESH_ENDPOINT = "/user/refresh-token";

let isRefreshing = false;
let refreshQueue = [];

function resolveRefreshQueue(error, accessToken = "") {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(accessToken);
  });

  refreshQueue = [];
}

function enqueueRefreshRequest() {
  return new Promise((resolve, reject) => {
    refreshQueue.push({ resolve, reject });
  });
}

function getBaseConfig() {
  return {
    baseURL: env.apiUrl,
    timeout: API_TIMEOUT_MS,
    withCredentials: true,
  };
}

function normalizeSuccessResponse(response) {
  const payload = response?.data;

  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const normalized = {
      ...payload,
      status: payload.status || "OK",
      message: payload.message || "",
      data: "data" in payload ? payload.data : payload,
      pagination: payload.pagination || null,
      meta: payload.meta || payload.pagination || null,
      errors: payload.errors || null,
      httpStatus: response.status,
      headers: response.headers,
    };

    return normalized;
  }

  return {
    status: "OK",
    message: "",
    data: payload,
    pagination: null,
    meta: null,
    errors: null,
    httpStatus: response?.status || 200,
    headers: response?.headers,
  };
}

function getErrorMessage(error, payloadMessage) {
  if (error.code === "ECONNABORTED") {
    return "The request timed out. Please try again.";
  }

  if (!error.response) {
    return "Network error. Please check your connection and try again.";
  }

  switch (error.response.status) {
    case 401:
      return payloadMessage || "Your session has expired. Please sign in again.";
    case 403:
      return payloadMessage || "You do not have permission to perform this action.";
    case 404:
      return payloadMessage || "The requested resource could not be found.";
    case 500:
      return payloadMessage || "The server encountered an error. Please try again later.";
    default:
      return payloadMessage || DEFAULT_ERROR_MESSAGE;
  }
}

function normalizeErrorResponse(error) {
  const payload = error.response?.data;
  const normalizedPayload =
    payload && typeof payload === "object" && !Array.isArray(payload)
      ? payload
      : {
          status: "ERROR",
          data: payload || null,
        };

  return {
    name: "ApiError",
    message: getErrorMessage(error, normalizedPayload.message),
    status: normalizedPayload.status || "ERROR",
    statusCode: error.response?.status || 0,
    data: "data" in normalizedPayload ? normalizedPayload.data : normalizedPayload,
    pagination: normalizedPayload.pagination || null,
    meta: normalizedPayload.meta || normalizedPayload.pagination || null,
    errors: normalizedPayload.errors || null,
    isTimeout: error.code === "ECONNABORTED",
    isNetworkError: !error.response,
    originalError: error,
  };
}

async function refreshAccessToken() {
  const response = await refreshClient.post(REFRESH_ENDPOINT);
  const normalized = normalizeSuccessResponse(response);
  const accessToken = normalized.data?.access_token || "";

  if (!accessToken) {
    throw new Error("Missing access token in refresh response.");
  }

  tokenService.setAccessToken(accessToken);
  store.dispatch(
    setCredentials({
      accessToken,
      user: store.getState().auth.user,
    })
  );

  return accessToken;
}

function attachRequestInterceptor(client, { withAuth = false } = {}) {
  client.interceptors.request.use(
    (config) => {
      const nextConfig = {
        ...config,
        headers: {
          Accept: "application/json",
          ...config.headers,
        },
      };

      if (!(nextConfig.data instanceof FormData) && !nextConfig.headers["Content-Type"]) {
        nextConfig.headers["Content-Type"] = "application/json";
      }

      if (withAuth) {
        const accessToken = tokenService.getAccessToken();

        if (accessToken) {
          nextConfig.headers.Authorization = `Bearer ${accessToken}`;
        }
      }

      return nextConfig;
    },
    (error) => Promise.reject(normalizeErrorResponse(error))
  );
}

function attachResponseInterceptor(client, { withAuthRefresh = false } = {}) {
  client.interceptors.response.use(
    (response) => normalizeSuccessResponse(response),
    async (error) => {
      const originalRequest = error.config || {};
      const statusCode = error.response?.status;
      const isRefreshRequest = originalRequest.url?.includes(REFRESH_ENDPOINT);
      const isAuthRequest =
        originalRequest.url?.includes("/user/sign-in") || originalRequest.url?.includes("/user/sign-up");

      if (!withAuthRefresh || statusCode !== 401 || originalRequest._retry || isRefreshRequest || isAuthRequest) {
        if (isRefreshRequest && statusCode === 401) {
          tokenService.clearAccessToken();
          store.dispatch(logout());
        }

        return Promise.reject(normalizeErrorResponse(error));
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        try {
          const accessToken = await enqueueRefreshRequest();
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${accessToken}`,
          };

          return client(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      isRefreshing = true;

      try {
        const accessToken = await refreshAccessToken();
        resolveRefreshQueue(null, accessToken);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`,
        };

        return client(originalRequest);
      } catch (refreshError) {
        const normalizedRefreshError =
          refreshError?.name === "ApiError" ? refreshError : normalizeErrorResponse(refreshError);

        tokenService.clearAccessToken();
        store.dispatch(logout());
        resolveRefreshQueue(normalizedRefreshError);

        return Promise.reject(normalizedRefreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}

const refreshClient = axios.create(getBaseConfig());

export const publicClient = axios.create(getBaseConfig());
export const apiClient = axios.create(getBaseConfig());

attachRequestInterceptor(publicClient);
attachRequestInterceptor(apiClient, { withAuth: true });

attachResponseInterceptor(publicClient);
attachResponseInterceptor(apiClient, { withAuthRefresh: true });
