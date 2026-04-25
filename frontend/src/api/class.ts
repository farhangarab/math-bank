import { apiFetch, throwApiError } from "./client";


// Get Class By ID
export async function getClassById(classId: number) {
  const res = await apiFetch(`/classes/one?class_id=${classId}`);

  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Failed to load class");
  }

  return data;
}
