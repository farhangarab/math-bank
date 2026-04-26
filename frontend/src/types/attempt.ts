export type AttemptStatus = "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED";

export type AttemptAnswer = {
  question_id: number;
  answer_text: string;
  score?: number;
  is_correct?: boolean;
};

export type AttemptResult = {
  question_id: number;
  is_correct: boolean;
  score: number;
};

export type AttemptSummary = {
  attempt_id: number | null;
  student_id: number;
  student_name: string;
  score: number | string | null;
  max_score: number | string;
  status: AttemptStatus;
};
