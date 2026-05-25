import { create } from "zustand";
import { api } from "@/lib/api";

export const useCartStore = create(
  (set, get) => ({
    cartItems: [],
    isLoading: false,

    addToCart: async (item, userId) => {
      const { cartItems } = get();
      const existingItem = cartItems.find((i) => i.product === item.product);

      let newCartItems;
      if (existingItem) {
        newCartItems = cartItems.map((i) =>
          i.product === item.product ? { ...i, amount: i.amount + item.amount } : i
        );
      } else {
        newCartItems = [...cartItems, item];
      }

      // Optimistic update
      set({ cartItems: newCartItems });

      if (userId) {
        try {
          const response = await api.post(`/cart/add/${userId}`, item);
          if (response.status === "OK") {
            // Re-sync with server state to ensure data integrity
            set({ cartItems: response.data.cartItems });
          }
        } catch (error) {
          console.error("Failed to add to cart on server", error);
        }
      }
    },

    removeFromCart: async (productId, userId) => {
      const { cartItems } = get();
      const newCartItems = cartItems.filter((i) => i.product !== productId);
      
      // Optimistic update
      set({ cartItems: newCartItems });

      if (userId) {
        try {
          const response = await api.delete(`/cart/remove/${userId}`, { data: { productId } });
          if (response.status === "OK") {
            set({ cartItems: response.data.cartItems });
          }
        } catch (error) {
          console.error("Failed to remove from cart on server", error);
        }
      }
    },

    updateQuantity: async (productId, amount, userId) => {
      const { cartItems } = get();
      const newCartItems = cartItems.map((i) =>
        i.product === productId ? { ...i, amount } : i
      ).filter(i => i.amount > 0);

      // Optimistic update
      set({ cartItems: newCartItems });

      if (userId) {
        try {
          const response = await api.put(`/cart/update/${userId}`, { productId, amount });
          if (response.status === "OK") {
            set({ cartItems: response.data.cartItems });
          }
        } catch (error) {
          console.error("Failed to update cart on server", error);
        }
      }
    },

    fetchCart: async (userId) => {
      if (!userId) {
        set({ cartItems: [] });
        return;
      }
      set({ isLoading: true });
      try {
        const response = await api.get(`/cart/get-all/${userId}`);
        if (response.status === "OK") {
          set({ cartItems: response.data.cartItems });
        }
      } catch (error) {
        console.error("Failed to fetch cart", error);
      } finally {
        set({ isLoading: false });
      }
    },

    syncCart: async (userId) => {
      const { cartItems } = get();
      if (!userId || cartItems.length === 0) return;
      try {
        const response = await api.post(`/cart/sync/${userId}`, { cartItems });
        if (response.status === "OK") {
          set({ cartItems: response.data.cartItems });
        }
      } catch (error) {
        console.error("Failed to sync cart", error);
      }
    },

    clearCart: () => set({ cartItems: [] }),
  })
);
