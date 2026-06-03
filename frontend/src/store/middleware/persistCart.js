import { storageKeys } from "@/config/constants";
import { storageService } from "@/services/storage.service";

export const persistCartMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type.startsWith("cart/")) {
    storageService.set(storageKeys.cart, store.getState().cart.items);
  }

  return result;
};
