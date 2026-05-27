import { authApi } from "@/api/auth.api";
import { tokenService } from "@/services/token.service";

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(normalized));
  } catch {
    return null;
  }
}

export const authService = {
  async login(payload) {
    const response = await authApi.login(payload);
    tokenService.setAccessToken(response?.access_token || response?.data?.access_token);
    return response;
  },
  async register(payload) {
    return authApi.register(payload);
  },
  async refresh() {
    const response = await authApi.refreshToken();
    tokenService.setAccessToken(response?.access_token || response?.data?.access_token);
    return response;
  },
  getSessionUser(token) {
    const payload = decodeJwt(token);
    if (!payload) {
      return null;
    }

    return {
      id: payload.id,
      _id: payload.id,
      isAdmin: payload.isAdmin,
    };
  },
  async logout() {
    try {
      await authApi.logout();
    } finally {
      tokenService.clearAccessToken();
    }
  },
};
