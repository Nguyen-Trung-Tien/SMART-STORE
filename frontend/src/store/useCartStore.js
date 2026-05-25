import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";

export const useCartStore = create(
  persist(
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

        set({ cartItems: newCartItems });

        if (userId) {
          try {
            await api.post(`/cart/add/${userId}`, item);
          } catch (error) {
            console.error("Failed to add to cart on server", error);
          }
        }
      },

      removeFromCart: async (productId, userId) => {
        const { cartItems } = get();
        const newCartItems = cartItems.filter((i) => i.product !== productId);
        set({ cartItems: newCartItems });

        if (userId) {
          try {
            await api.delete(`/cart/remove/${userId}`, { data: { productId } });
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

        set({ cartItems: newCartItems });

        if (userId) {
          try {
            await api.put(`/cart/update/${userId}`, { productId, amount });
          } catch (error) {
            console.error("Failed to update cart on server", error);
          }
        }
      },

      fetchCart: async (userId) => {
        if (!userId) return;
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
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        cartItems: state.cartItems.map(item => ({
          ...item,
          image: item.image?.startsWith("data:image") ? null : item.image
        })),
      }),
    }
  )
);
