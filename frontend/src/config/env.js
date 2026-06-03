const env = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  appName: import.meta.env.VITE_APP_NAME || "Smart Store",
  enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === "true",
};

export default env;
