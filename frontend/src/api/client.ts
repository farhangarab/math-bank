import { API_BASE_URL } from "./apiConfig";

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

type ApiResponseData = {
  message?: unknown;
  error?: unknown;
  errors?: unknown;
};

function asApiResponseData(data: unknown): ApiResponseData {
  return data && typeof data === "object" ? data : {};
}

function getFieldErrors(errors: unknown): FieldErrors {
  if (!errors || typeof errors !== "object") return {};

  return Object.fromEntries(
    Object.entries(errors).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
}

export async function apiFetch(path: string, options: ApiFetchOptions = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  return response;
}

export function getBestApiMessage(data: unknown, fallback: string) {
  const apiData = asApiResponseData(data);

  if (typeof apiData.message === "string" && apiData.message) {
    return apiData.message;
  }

  if (typeof apiData.error === "string" && apiData.error) {
    return apiData.error;
  }

  return fallback;
}

export function throwApiError(data: unknown, fallback: string): never {
  const apiData = asApiResponseData(data);

  throw new ApiError(getBestApiMessage(apiData, fallback), getFieldErrors(apiData.errors));
}

export { API_BASE_URL };
