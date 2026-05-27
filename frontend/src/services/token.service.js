import Cookies from "js-cookie";
import { storageKeys } from "@/config/constants";

const cookieOptions = {
  sameSite: "strict",
  secure: window.location.protocol === "https:",
  expires: 1,
};

export const tokenService = {
  getAccessToken() {
    return Cookies.get(storageKeys.accessToken) || "";
  },
  setAccessToken(token) {
    if (!token) {
      this.clearAccessToken();
      return;
    }
    Cookies.set(storageKeys.accessToken, token, cookieOptions);
  },
  clearAccessToken() {
    Cookies.remove(storageKeys.accessToken);
  },
};
