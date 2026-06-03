export const permissions = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};

export function isAdmin(user) {
  return Boolean(user?.isAdmin || user?.role === permissions.ADMIN);
}
