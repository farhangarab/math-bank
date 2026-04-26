import type { GradingType } from "../types/question";

export function answerLooksNumeric(answerText: string) {
  return !/[a-zA-Z]/.test(answerText);
}

export function getGradingTypeLabel(gradingType: GradingType | string) {
  if (gradingType === "exact") return "Exact";
  if (gradingType === "symbolic") return "Symbolic";
  if (gradingType === "numeric") return "Numeric";
  return gradingType;
}

export function getTeacherGuidance(
  gradingType: GradingType | string,
  requireSimplified: boolean,
) {
  if (gradingType === "exact") {
    return "Use Exact when you want students to match the written form of the answer. Spaces are ignored.";
  }

  if (gradingType === "numeric") {
    return "Use Numeric only for number-only answers like 8, 2/3, or 0.25.";
  }

  if (requireSimplified) {
    return "Use Symbolic + Require simplified when equivalent algebra is okay, but students must simplify their final form.";
  }

  return "Use Symbolic when equivalent algebraic answers should be accepted even if they look different.";
}

export function getStudentGuidance(
  gradingType: GradingType | string,
  requireSimplified: boolean,
) {
  if (gradingType === "exact") {
    return "Match the teacher's answer form exactly. Spaces do not matter.";
  }

  if (gradingType === "numeric") {
    return "Enter a numeric value only, such as 8, 2/3, or 0.25.";
  }

  if (requireSimplified) {
    return "Equivalent algebra is accepted, but your final answer must be simplified.";
  }

  return "Equivalent algebra is accepted. Your answer does not have to match the same written form.";
}
