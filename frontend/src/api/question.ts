const API = "http://127.0.0.1:5000/api/questions";


// get all questions by assignment
export async function getQuestions(assignmentId: number) {
  const res = await fetch(
    `${API}?assignment_id=${assignmentId}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed");
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
  const res = await fetch(`${API}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

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
    throw new Error(data.error || "Create failed");
  }

  return data;
}