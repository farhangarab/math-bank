const apiHost =
  typeof window === "undefined" ? "localhost" : window.location.hostname;

const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function getApiBaseUrl() {
  if (!envApiBaseUrl) {
    if (import.meta.env.PROD) {
      throw new Error("VITE_API_BASE_URL is required for production builds.");
    }

    return `http://${apiHost}:5000/api`;
  }

  const apiBaseUrl = envApiBaseUrl.replace(/\/+$/, "");

  if (apiHost === "localhost" && apiBaseUrl.includes("127.0.0.1")) {
    return apiBaseUrl.replace("127.0.0.1", "localhost");
  }

  if (apiHost === "127.0.0.1" && apiBaseUrl.includes("localhost")) {
    return apiBaseUrl.replace("localhost", "127.0.0.1");
  }

  return apiBaseUrl;
}

export const API_BASE_URL = getApiBaseUrl();
