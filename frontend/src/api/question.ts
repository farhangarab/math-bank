import { apiFetch, throwApiError } from "./client";


// get all questions by assignment id
export async function getQuestions(assignmentId: number) {
  const res = await apiFetch(`/questions/?assignment_id=${assignmentId}`);

  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Failed to load questions");
  }

  return data;
}


// create question
export async function createQuestion(
  assignmentId: number,
  questionText: string,
  correctAnswer: string,
  orderIndex: number,
  points: number,
  gradingType: string,         
  requireSimplified: boolean  
) {
  const res = await apiFetch("/questions/create", {
    method: "POST",
    body: JSON.stringify({
      assignment_id: assignmentId,
      question_text: questionText,
      correct_answer: correctAnswer,
      order_index: orderIndex,
      points,
      grading_type: gradingType,             
      require_simplified: requireSimplified  
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throwApiError(data, "Create question failed");
  }

  return data.data?.question ?? data.question;
}
