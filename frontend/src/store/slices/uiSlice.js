import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    cartSheetOpen: false,
    commandMenuOpen: false,
  },
  reducers: {
    setCartSheetOpen(state, action) {
      state.cartSheetOpen = action.payload;
    },
    setCommandMenuOpen(state, action) {
      state.commandMenuOpen = action.payload;
    },
  },
});

export const { setCartSheetOpen, setCommandMenuOpen } = uiSlice.actions;
export default uiSlice.reducer;
