import Header from "../components/Header";
import Button from "../components/Button";
import MathToolbar from "../components/MathToolbar";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getAssignmentById } from "../api/assignments";
import { getClassById } from "../api/classes";
import { getQuestions, createQuestion } from "../api/question";
import MathPreview from "../components/MathPreview";
import QuestionList from "../components/QuestionList";
import Alert from "../components/Alert";
import { useMessage } from "../hooks/useMessage";
import { firstInvalid } from "../utils/validation";
import MessageSlot from "../components/MessageSlot";
import type { Assignment } from "../types/assignment";
import type { ClassInfo } from "../types/class";
import type { GradingType, Question } from "../types/question";
import { answerLooksNumeric, getTeacherGuidance } from "../utils/grading";

function AssignmentEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [points, setPoints] = useState("1");

  const [gradingType, setGradingType] = useState<GradingType>("symbolic");
  const [requireSimplified, setRequireSimplified] = useState(false);
  const {
    message,
    fieldErrors,
    clearAllMessages,
    clearFieldError,
    showApiError,
    showFieldError,
    showSuccess,
  } = useMessage();

  const [activeInput, setActiveInput] = useState<
    HTMLInputElement | HTMLTextAreaElement | null
  >(null);
  const [activeField, setActiveField] = useState<"question" | "answer" | null>(
    null,
  );

  const handleBack = () => navigate(-1);

  async function loadAll() {
    if (!id) return;
    const a = await getAssignmentById(Number(id));
    setAssignment(a);
    const c = await getClassById(a.class_id);
    setClassInfo(c);
    const qs = await getQuestions(a.id);
    setQuestions(qs);
  }

  useEffect(() => {
    loadAll();
  }, [id]);

  async function handleAddQuestion() {
    clearAllMessages();

    const invalid = firstInvalid([
      {
        field: "question_text",
        message: "Question is required.",
        isValid: text.trim() !== "",
      },
      {
        field: "correct_answer",
        message: "Correct answer is required.",
        isValid: answer.trim() !== "",
      },
      {
        field: "points",
        message: "Points must be at least 1.",
        isValid: Number(points) >= 1,
      },
    ]);

    if (invalid) {
      showFieldError(invalid.field, invalid.message);
      return;
    }

    const orderIndex = questions.length + 1;

    try {
      const newQuestion = await createQuestion(
        Number(id),
        text,
        answer,
        orderIndex,
        Number(points),
        gradingType,
        requireSimplified,
      );

      setText("");
      setAnswer("");
      setPoints("1");
      setQuestions((currentQuestions) => [...currentQuestions, newQuestion]);
      showSuccess("Question created successfully.");
    } catch (error) {
      showApiError(error, "Failed to save question.");
    }
  }

  const numericWarning =
    gradingType === "numeric" && answer.trim() && !answerLooksNumeric(answer);
  const teacherGuidance = getTeacherGuidance(gradingType, requireSimplified);

  return (
    <div className="min-h-screen bg-white">
      <Header title="MATHBANK" leftText="Back" leftAction={handleBack} />

      <div className="flex flex-col items-center mt-10 pb-10">
        {classInfo && (
          <h1 className="text-3xl text-brand-primary font-bold">
            {classInfo.class_name}
          </h1>
        )}
        {assignment && (
          <h2 className="text-2xl font-semibold text-brand-primary mt-4">
            {assignment.title}
          </h2>
        )}

        {/*
          FORM CARD
          - flex flex-col so toolbar can sit at the bottom
          - max-h + overflow-y-auto on the inner content makes only
            the fields scroll, while the toolbar stays pinned at the bottom
        */}
        <div
          className="w-[800px] border border-brand-primary rounded mt-6 flex flex-col"
          style={{ maxHeight: "calc(100vh - 220px)" }}
        >
          {/* ── scrollable content area ── */}
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-xl font-bold text-brand-primary mb-6">
              Add Question
            </h3>

            {/* QUESTION */}
            <div className="mb-6">
              <label className="block text-brand-primary font-medium mb-2">
                Question
              </label>
              <textarea
                id="question-input"
                onFocus={(e) => {
                  setActiveInput(e.target);
                  setActiveField("question");
                }}
                placeholder="Write your question..."
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  clearFieldError("question_text");
                }}
                aria-invalid={Boolean(fieldErrors.question_text)}
                className={`w-full min-h-[120px] rounded border p-3 focus:outline-none ${
                  fieldErrors.question_text
                    ? "border-status-errorText bg-status-errorBg"
                    : "border-brand-primary"
                }`}
              />
              {fieldErrors.question_text && (
                <p className="mt-1 text-sm text-status-errorText">
                  {fieldErrors.question_text}
                </p>
              )}
              <div className="relative mt-1">
                <MathPreview expression={text} noBorder />
                {text && (
                  <span className="absolute top-2 right-2 text-[10px] text-gray-400 uppercase tracking-wide">
                    student view
                  </span>
                )}
              </div>
            </div>

            {/* SETTINGS */}
            <div className="flex gap-4 mb-6 items-center">
              <select
                value={gradingType}
                onChange={(e) => {
                  clearAllMessages();
                  setGradingType(e.target.value as GradingType);
                  if (e.target.value !== "symbolic")
                    setRequireSimplified(false);
                }}
                className="border border-brand-primary p-2 rounded"
              >
                <option value="exact">Exact</option>
                <option value="symbolic">Symbolic</option>
                <option value="numeric">Numeric</option>
              </select>

              <label className="flex items-center gap-2 text-brand-primary">
                <input
                  type="checkbox"
                  checked={requireSimplified}
                  disabled={gradingType !== "symbolic"}
                  onChange={(e) => setRequireSimplified(e.target.checked)}
                />
                Require simplified
              </label>
            </div>

            <div className="mb-4">
              <Alert
                type="info"
                message={`Type: ${gradingType}. Simplified required: ${
                  requireSimplified ? "Yes" : "No"
                }. ${teacherGuidance}`}
              />
            </div>

            {numericWarning && (
              <div className="mb-6">
                <Alert
                  type="warning"
                  message="Numeric grading is for answers like 3.5, 2/3, or 8. If the answer contains variables like x, use symbolic or exact grading instead."
                />
              </div>
            )}

            {/* ANSWER */}
            <div className="mb-6">
              <label className="block text-brand-primary font-medium mb-2">
                Answer
              </label>
              <input
                id="answer-input"
                onFocus={(e) => {
                  setActiveInput(e.target);
                  setActiveField("answer");
                }}
                type="text"
                placeholder="Correct answer (e.g., 4*x)"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  clearFieldError("correct_answer");
                }}
                aria-invalid={Boolean(fieldErrors.correct_answer)}
                className={`w-full rounded border p-3 focus:outline-none ${
                  fieldErrors.correct_answer
                    ? "border-status-errorText bg-status-errorBg"
                    : "border-brand-primary"
                }`}
              />
              {fieldErrors.correct_answer && (
                <p className="mt-1 text-sm text-status-errorText">
                  {fieldErrors.correct_answer}
                </p>
              )}
              {answer && (
                <div className="relative mt-1">
                  <MathPreview expression={answer} noBorder />
                  <span className="absolute top-2 right-2 text-[10px] text-gray-400 uppercase tracking-wide">
                    student view
                  </span>
                </div>
              )}
            </div>

            {/* POINTS */}
            <input
              type="number"
              placeholder="Points"
              value={points}
              onChange={(e) => {
                setPoints(e.target.value);
                clearFieldError("points");
              }}
              aria-invalid={Boolean(fieldErrors.points)}
              className={`w-full rounded border p-3 focus:outline-none ${
                fieldErrors.points
                  ? "border-status-errorText bg-status-errorBg"
                  : "border-brand-primary"
              }`}
            />
            {fieldErrors.points && (
              <p className="mt-1 text-sm text-status-errorText">
                {fieldErrors.points}
              </p>
            )}
            <MessageSlot message={message} />
            <Button onClick={handleAddQuestion}>Save Question</Button>
          </div>

          {/* ── sticky toolbar — always visible at the bottom of the card ── */}
          <div className="border-t border-brand-primary bg-white shrink-0">
            <MathToolbar
              activeInput={activeInput}
              activeField={activeField}
              onQuestionChange={setText}
              onAnswerChange={setAnswer}
            />
          </div>
        </div>

        {/* QUESTIONS LIST */}
        <div className="w-[800px] border border-brand-primary rounded p-6 mt-6">
          <h3 className="text-xl font-bold text-brand-primary mb-4">Questions</h3>
          <QuestionList questions={questions} />
        </div>
      </div>
    </div>
  );
}

export default AssignmentEditorPage;
