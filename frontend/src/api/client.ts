const apiHost =
  typeof window === "undefined" ? "localhost" : window.location.hostname;

const API_BASE = `http://${apiHost}:5000/api`;

type ApiFetchOptions = RequestInit & {
  headers?: HeadersInit;
};

export async function apiFetch(path: string, options: ApiFetchOptions = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  return response;
}

export { API_BASE };
