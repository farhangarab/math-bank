import type { AuthUser } from "../types/auth";
import { apiFetch, throwApiError } from "./client";

export async function loginUser(
  identifier: string,
  password: string,
  remember: boolean
) {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username: identifier,
      password,
      remember,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Login failed");
  }

  return data.data ?? data;
}



export async function registerUser(
  username: string,
  full_name: string,
  email: string,
  password: string,
  role: string,
  teacher_code?: string
) {
  const response = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      full_name,
      email,
      password,
      role,
      teacher_code,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throwApiError(data, "Register failed");
  }

  return data;
}

export async function logoutUser() {
  const res = await apiFetch("/auth/logout", {
    method: "POST",
  });

  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Logout failed");
  }

  return data;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const res = await apiFetch("/auth/me");
  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Failed to load current user");
  }

  return data.data?.user ?? data.user;
}

export async function joinClass(classCode: string) {
  const res = await apiFetch("/student/join-class", {
    method: "POST",
    body: JSON.stringify({
      class_code: classCode,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Join failed");
  }

  return data;
}

export async function getStudentClasses() {
  const res = await apiFetch("/student/classes");

  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Failed to load classes");
  }

  return data;
}

export async function getTeacherClasses() {
  const res = await apiFetch("/classes/teacher-classes");

  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Failed to load classes");
  }

  return data;
}

export async function createClass(className: string) {
  const res = await apiFetch("/classes/create", {
    method: "POST",
    body: JSON.stringify({
      class_name: className,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Create class failed");
  }

  return data;
}
