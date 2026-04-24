import { apiFetch } from "./client";


// Get Class By ID
export async function getClassById(classId: number) {
  const res = await apiFetch(`/classes/one?class_id=${classId}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to load class");
  }

  return data;
}
