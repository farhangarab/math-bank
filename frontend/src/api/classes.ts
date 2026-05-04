import type { ClassInfo, ClassStudentsResponse } from "../types/class";
import { apiFetch, throwApiError } from "./client";

export async function getClassById(classId: number): Promise<ClassInfo> {
  const res = await apiFetch(`/classes/one?class_id=${classId}`);
  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Failed to load class");
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

export async function updateClass(classId: number, className: string) {
  const res = await apiFetch(`/classes/${classId}`, {
    method: "PUT",
    body: JSON.stringify({
      class_name: className,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Update class failed");
  }

  return data;
}

export async function deleteClass(classId: number) {
  const res = await apiFetch(`/classes/${classId}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Delete class failed");
  }

  return data;
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

export async function getStudentClasses(): Promise<ClassInfo[]> {
  const res = await apiFetch("/student/classes");
  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Failed to load classes");
  }

  return data;
}

export async function getTeacherClasses(): Promise<ClassInfo[]> {
  const res = await apiFetch("/classes/teacher-classes");
  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Failed to load classes");
  }

  return data;
}

export async function getClassStudents(
  classId: number
): Promise<ClassStudentsResponse> {
  const res = await apiFetch(`/classes/${classId}/students`);
  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Failed to load students");
  }

  return data;
}

export async function removeClassStudent(
  classId: number,
  studentId: number
) {
  const res = await apiFetch(`/classes/${classId}/students/${studentId}`, {
    method: "DELETE",
  });
  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Failed to remove student");
  }

  return data;
}
