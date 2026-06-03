export const storageService = {
  get(key, fallback = null) {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    window.localStorage.removeItem(key);
  },
};
