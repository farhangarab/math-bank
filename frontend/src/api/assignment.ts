import type { Assignment } from "../types/assignment";
import { apiFetch } from "./client";

// Get assignments by class
export async function getAssignments(classId: number): Promise<Assignment[]> {
  const res = await apiFetch(`/assignments/?class_id=${classId}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to load assignments");
  }

  return data;
}




// Create assignment
export async function createAssignment(
  title: string,
  classId: number,
  dueDate?: string
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
    throw new Error(data.error || "Create assignment failed");
  }

  return data;
}

//Get assignment by id
export async function getAssignmentById(id: number) {
  const res = await apiFetch(`/assignments/one?id=${id}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed");
  }

  return data;
}

//Get submission for each student
export async function getAssignmentAttempts(assignmentId: number) {
  const res = await apiFetch(`/assignments/${assignmentId}/attempts`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to load submissions");
  }

  return data;
}
