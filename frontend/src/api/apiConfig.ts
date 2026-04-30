const apiHost =
  typeof window === "undefined" ? "localhost" : window.location.hostname;

const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function getApiBaseUrl() {
  if (!envApiBaseUrl) {
    return `http://${apiHost}:5000/api`;
  }

  if (apiHost === "localhost" && envApiBaseUrl.includes("127.0.0.1")) {
    return envApiBaseUrl.replace("127.0.0.1", "localhost");
  }

  if (apiHost === "127.0.0.1" && envApiBaseUrl.includes("localhost")) {
    return envApiBaseUrl.replace("localhost", "127.0.0.1");
  }

  return envApiBaseUrl;

  
}

export const API_BASE_URL = getApiBaseUrl();
