export type GradingType = "exact" | "symbolic" | "numeric";

export type Question = {
  id: number;
  question_text: string;
  correct_answer?: string;
  points: number;
  order_index?: number;
  assignment_id?: number;
  grading_type: GradingType;
  require_simplified: boolean;
};

export type QuestionForm = {
  question_text: string;
  correct_answer: string;
  points: number;
  order_index: number;
  grading_type: GradingType;
  require_simplified: boolean;
};
