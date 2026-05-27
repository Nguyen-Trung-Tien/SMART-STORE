import { queryKeys as baseQueryKeys } from "@/lib/queryKeys";

export const queryKeys = {
  ...baseQueryKeys,
  users: baseQueryKeys.users.list,
  orders: (userId) => baseQueryKeys.orders.list(userId),
  adminOrders: baseQueryKeys.orders.admin,
  products: baseQueryKeys.products.all,
  productDetail: (id) => baseQueryKeys.products.byId(id),
};

export const storageKeys = {
  accessToken: "smart_store_access_token",
  theme: "smart-store-theme",
  cart: "smart-store-cart",
};
