const apiHost =
  typeof window === "undefined" ? "localhost" : window.location.hostname;

const API_BASE = `http://${apiHost}:5000/api`;

type ApiFetchOptions = RequestInit & {
  headers?: HeadersInit;
};

export type FieldErrors = Record<string, string>;

export class ApiError extends Error {
  errors: FieldErrors;

  constructor(message: string, errors: FieldErrors = {}) {
    super(message);
    this.name = "ApiError";
    this.errors = errors;
  }
}

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

export function getBestApiMessage(data: any, fallback: string) {
  if (typeof data?.message === "string" && data.message) return data.message;
  if (typeof data?.error === "string" && data.error) return data.error;

  return fallback;
}

export function throwApiError(data: any, fallback: string): never {
  throw new ApiError(getBestApiMessage(data, fallback), data?.errors ?? {});
}

export { API_BASE };
