import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import cartReducer from "@/store/slices/cartSlice";
import uiReducer from "@/store/slices/uiSlice";
import userReducer from "@/store/slices/userSlice";
import { persistCartMiddleware } from "@/store/middleware/persistCart";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    user: userReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistCartMiddleware),
});
