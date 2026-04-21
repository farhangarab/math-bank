const API = "http://127.0.0.1:5000/api";

// start the assignment
export async function startAttempt(userId: number ,assignmentId: number) {
  const res = await fetch(`${API}/attempts/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      student_id: userId,
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
  const res = await fetch(`${API}/attempts/${attemptId}`);
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
  const res = await fetch(`${API}/attempts/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
  const res = await fetch(`${API}/attempts/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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