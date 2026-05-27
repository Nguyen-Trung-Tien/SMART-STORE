import { createSlice } from "@reduxjs/toolkit";
import { storageKeys } from "@/config/constants";
import { storageService } from "@/services/storage.service";

const initialState = {
  items: storageService.get(storageKeys.cart, []),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existing = state.items.find((entry) => entry._id === item._id);

      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 });
      }
    },
    updateCartQuantity(state, action) {
      const { productId, quantity } = action.payload;
      state.items = state.items.map((item) =>
        item._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      );
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, updateCartQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
