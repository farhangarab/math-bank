import { apiFetch } from "./client";

// start the assignment
export async function startAttempt(assignmentId: number) {
  const res = await apiFetch("/attempts/start", {
    method: "POST",
    body: JSON.stringify({
      assignment_id: assignmentId,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to start assignment");
  }

  return data;
}


// get the questions in assignment with attempt id
export async function getAttempt(attemptId: number) {
  const res = await apiFetch(`/attempts/${attemptId}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to load attempt");
  }

  return data;
}

// Submit all answers for assignment
export async function submitAttempt(
  attemptId: number,
  answers: { question_id: number; answer_text: string }[]
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
    throw new Error(data.error || "Failed to submit");
  }

  return data;
}

//Save the progress
export async function saveAttempt(
  attemptId: number,
  answers: { question_id: number; answer_text: string }[]
) {
  const res = await apiFetch("/attempts/save", {
    method: "POST",
    body: JSON.stringify({
      attempt_id: attemptId,
      answers,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to save");
  }

  return data;
}
