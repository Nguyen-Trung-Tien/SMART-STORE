export const queryKeys = {
  authUser: ["auth", "user"],
  products: ["products"],
  productDetail: (id) => ["products", id],
  orders: (userId) => ["orders", userId],
  adminOrders: ["admin-orders"],
  users: ["users"],
};

export const storageKeys = {
  accessToken: "smart_store_access_token",
  theme: "smart-store-theme",
  cart: "smart-store-cart",
};
