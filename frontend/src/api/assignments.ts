import type { Assignment } from "../types/assignment";
import { apiFetch, throwApiError } from "./client";

export async function getAssignments(classId: number): Promise<Assignment[]> {
  const res = await apiFetch(`/assignments/?class_id=${classId}`);
  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Failed to load assignments");
  }

  return data;
}

export async function createAssignment(
  title: string,
  classId: number,
  dueDate?: string,
) {
  const res = await apiFetch("/assignments/create", {
    method: "POST",
    body: JSON.stringify({
      title,
      class_id: classId,
      due_date: dueDate,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Create assignment failed");
  }

  return data;
}

export async function getAssignmentById(id: number): Promise<Assignment> {
  const res = await apiFetch(`/assignments/one?id=${id}`);
  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Failed to load assignment");
  }

  return data;
}

export async function getAssignmentAttempts(assignmentId: number) {
  const res = await apiFetch(`/assignments/${assignmentId}/attempts`);
  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Failed to load submissions");
  }

  return data;
}
