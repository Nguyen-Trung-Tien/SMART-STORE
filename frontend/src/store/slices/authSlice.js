import { createSlice } from "@reduxjs/toolkit";
import { tokenService } from "@/services/token.service";

const initialState = {
  accessToken: tokenService.getAccessToken(),
  user: null,
  isAuthenticated: Boolean(tokenService.getAccessToken()),
  isHydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isHydrated = true;
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = Boolean(state.accessToken);
      state.isHydrated = true;
    },
    markHydrated(state) {
      state.isHydrated = true;
    },
    logout(state) {
      state.accessToken = "";
      state.user = null;
      state.isAuthenticated = false;
      state.isHydrated = true;
    },
  },
});

export const { setCredentials, setUser, markHydrated, logout } = authSlice.actions;
export default authSlice.reducer;
