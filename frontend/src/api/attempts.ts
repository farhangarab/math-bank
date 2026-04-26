import type { AttemptAnswer } from "../types/attempt";
import { apiFetch, throwApiError } from "./client";

export async function startAttempt(assignmentId: number) {
  const res = await apiFetch("/attempts/start", {
    method: "POST",
    body: JSON.stringify({
      assignment_id: assignmentId,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Failed to start assignment");
  }

  return data.data ?? data;
}

export async function getAttempt(attemptId: number) {
  const res = await apiFetch(`/attempts/${attemptId}`);
  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Failed to load attempt");
  }

  return data.data ?? data;
}

export async function submitAttempt(
  attemptId: number,
  answers: AttemptAnswer[],
) {
  const res = await apiFetch("/attempts/submit", {
    method: "POST",
    body: JSON.stringify({
      attempt_id: attemptId,
      answers,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Failed to submit");
  }

  return data.data ?? data;
}

export async function saveAttempt(attemptId: number, answers: AttemptAnswer[]) {
  const res = await apiFetch("/attempts/save", {
    method: "POST",
    body: JSON.stringify({
      attempt_id: attemptId,
      answers,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Failed to save");
  }

  return data.data ?? data;
}
