import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) => 
        set({ user, accessToken, isAuthenticated: true }),
      clearAuth: () => 
        set({ user: null, accessToken: null, isAuthenticated: false }),
      updateUser: (user) => 
        set((state) => {
          const newUser = { ...state.user, ...user };
          // If avatar is base64, we don't want to persist it if possible, 
          // but since it's used for preview, we might need it.
          // However, for storage quota, it's better to prune it if it's too large
          // or just let the backend update handle it (which now returns a URL).
          return { user: newUser };
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        user: state.user ? {
          ...state.user,
          avatar: state.user.avatar?.startsWith("data:image") ? null : state.user.avatar
        } : null,
      }),
    }
  )
);
