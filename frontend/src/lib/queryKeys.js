function compactObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== null && item !== ""));
}

export const queryKeys = {
  auth: {
    all: ["auth"],
    profile: (userId) => ["auth", "profile", userId],
  },
  products: {
    all: ["products"],
    lists: () => ["products", "list"],
    list: (params = {}) => ["products", "list", compactObject(params)],
    infinite: (params = {}) => ["products", "infinite", compactObject(params)],
    details: () => ["products", "detail"],
    detail: (slug) => ["products", "detail", slug],
    byId: (id) => ["products", "by-id", id],
  },
  categories: {
    all: ["categories"],
    list: (params = {}) => ["categories", "list", compactObject(params)],
    detail: (identifier) => ["categories", "detail", identifier],
  },
  cart: {
    all: ["cart"],
    detail: (userId) => ["cart", userId],
  },
  reviews: {
    all: ["reviews"],
    product: (productId) => ["reviews", "product", productId],
  },
  orders: {
    all: ["orders"],
    list: (userId) => ["orders", "list", userId],
    admin: ["orders", "admin"],
    detail: (orderId) => ["orders", "detail", orderId],
  },
  uploads: {
    all: ["uploads"],
    config: ["uploads", "config"],
  },
  users: {
    all: ["users"],
    list: ["users", "list"],
    detail: (userId) => ["users", "detail", userId],
  },
  profile: ["profile"],
  authUser: ["auth", "user"],
  adminOrders: ["orders", "admin"],
};
