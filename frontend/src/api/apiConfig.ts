const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl && import.meta.env.PROD) {
  throw new Error("VITE_API_BASE_URL is required in production.");
}

export const API_BASE_URL = apiBaseUrl || "http://127.0.0.1:5000/api";