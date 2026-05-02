import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { getAssignmentById } from "../api/assignments";
import { getAttempt, saveAttempt, submitAttempt } from "../api/attempts";
import { getClassById } from "../api/classes";
import FloatingMathToolbar from "../components/assignment-editor/FloatingMathToolbar";
import NumericWarning from "../components/assignment-editor/NumericWarning";
import Button from "../components/Button";
import ConfirmModal from "../components/ConfirmModal";
import Header from "../components/Header";
import MathPreview from "../components/MathPreview";
import MessageSlot from "../components/MessageSlot";
import Panel from "../components/Panel";
import Tooltip from "../components/ui/Tooltip";
import { useAuth } from "../context/AuthContext";
import { useMessage } from "../hooks/useMessage";
import type { Assignment } from "../types/assignment";
import type {
  AttemptAnswer,
  AttemptResult,
  AttemptStatus,
} from "../types/attempt";
import type { ClassInfo } from "../types/class";
import type { Question } from "../types/question";
import { formatDueDate, formatNumber } from "../utils/format";
import { answerLooksNumeric, getStudentGuidance } from "../utils/grading";

const StudentAssignmentPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [savedAnswers, setSavedAnswers] = useState<Record<number, string>>({});
  const [showPreview, setShowPreview] = useState(true);
  const [showMathSymbols, setShowMathSymbols] = useState(false);
  const [activeInput, setActiveInput] = useState<HTMLTextAreaElement | null>(
    null,
  );

  const [result, setResult] = useState<{
    total_score: number;
    results: AttemptResult[];
  } | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [attemptStatus, setAttemptStatus] = useState<AttemptStatus | "">("");
  const isSubmitted = attemptStatus === "SUBMITTED";
  const isReviewMode =
    searchParams.get("mode") === "review" || user?.role === "TEACHER";
  const isReadOnly = isReviewMode || isSubmitted;

  const { message, clearAllMessages, showApiError, showSuccess } = useMessage();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [showUnansweredWarning, setShowUnansweredWarning] = useState(false);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion
    ? answers[currentQuestion.id] || ""
    : "";
  const numericWarning =
    currentQuestion?.grading_type === "numeric" &&
    currentAnswer.trim() &&
    !answerLooksNumeric(currentAnswer);
  const currentResult = result?.results?.find(
    (r) => r.question_id === currentQuestion?.id,
  );
  const showReviewDetails = Boolean(result) && isReadOnly;
  const gradingGuidance = currentQuestion
    ? getStudentGuidance(
        currentQuestion.grading_type,
        currentQuestion.require_simplified,
      )
    : "";
  const previewGradingMessage = currentQuestion
    ? currentQuestion.grading_type === "symbolic"
      ? "Symbolic grading accepts equivalent answers."
      : gradingGuidance
    : "";
  const totalPoints = questions.reduce(
    (total, question) => total + question.points,
    0,
  );
  const hasStudentScore =
    result?.total_score !== undefined && result?.total_score !== null;
  const unansweredQuestions = questions.filter(
    (question) => !answers[question.id]?.trim(),
  );
  const hasUnansweredQuestions = unansweredQuestions.length > 0;
  const confirmMessage = showUnansweredWarning
    ? "Some questions are unanswered. Are you sure you want to submit? Once you submit, there is no way back."
    : "Once you submit, your answers will be locked and cannot be changed.";

  const formatAnswers = (): AttemptAnswer[] => {
    return Object.entries(answers).map(([questionId, value]) => ({
      question_id: Number(questionId),
      answer_text: value,
    }));
  };

  const isChanged = () => {
    return JSON.stringify(answers) !== JSON.stringify(savedAnswers);
  };

  const handleBack = () => {
    if (!isReadOnly && isChanged()) {
      setShowBackConfirm(true);
      return;
    }

    navigate(-1);
  };

  const getQuestionButtonClass = (question: Question, index: number) => {
    const isCurrentQuestion = index === currentIndex;
    const isAnswered = Boolean(answers[question.id]?.trim());

    if ((showUnansweredWarning || isSubmitted) && !isAnswered) {
      return "border-status-errorBorder bg-status-errorBg text-status-errorText";
    }

    if (isCurrentQuestion) {
      return "border-status-infoBorder bg-status-infoBg text-status-infoText";
    }

    if (isAnswered) {
      return "border-status-successBorder bg-status-successBg text-status-successText";
    }

    return "border-brand-borderSoft bg-brand-surface text-gray-500";
  };

  const handleSave = async () => {
    if (isReadOnly) return;
    clearAllMessages();

    try {
      await saveAttempt(Number(attemptId), formatAnswers());
      setSavedAnswers(answers);
      showSuccess("Progress saved successfully.");
    } catch (err) {
      showApiError(err, "Failed to save progress.");
    }
  };

  const handleSubmitClick = () => {
    setShowUnansweredWarning(hasUnansweredQuestions);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (isReadOnly) return;

    setShowConfirm(false);
    clearAllMessages();
    try {
      await submitAttempt(Number(attemptId), formatAnswers());

      const submittedAttempt = await getAttempt(Number(attemptId));

      setQuestions(submittedAttempt.questions);
      setAttemptStatus("SUBMITTED");
      setSubmittedAt(submittedAttempt.submitted_at ?? null);
      setResult({
        total_score: submittedAttempt.total_score,
        results: submittedAttempt.answers.map((answer: AttemptAnswer) => ({
          question_id: answer.question_id,
          is_correct: Boolean(answer.is_correct),
          score: answer.score ?? 0,
        })),
      });
      showSuccess("Assignment submitted successfully.");
    } catch (err) {
      showApiError(err, "Failed to submit assignment.");
    }
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    if (isReadOnly) return;
    clearAllMessages();

    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleToolbarAnswerChange = (value: string) => {
    if (!currentQuestion) return;
    handleAnswerChange(currentQuestion.id, value);
  };

  useEffect(() => {
    if (!hasUnansweredQuestions) {
      setShowUnansweredWarning(false);
    }
  }, [hasUnansweredQuestions]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAttempt(Number(attemptId));

        setQuestions(data.questions);
        setAttemptStatus(data.status);
        setSubmittedAt(data.submitted_at ?? null);

        try {
          const loadedAssignment = await getAssignmentById(data.assignment_id);
          const loadedClass = await getClassById(loadedAssignment.class_id);
          setAssignment(loadedAssignment);
          setClassInfo(loadedClass);
        } catch (assignmentError) {
          console.error(assignmentError);
        }

        const saved: Record<number, string> = {};
        data.answers.forEach((answer: AttemptAnswer) => {
          saved[answer.question_id] = answer.answer_text;
        });

        setAnswers(saved);
        setSavedAnswers(saved);

        if (data.status === "SUBMITTED") {
          setResult({
            total_score: data.total_score,
            results: data.answers.map((answer: AttemptAnswer) => ({
              question_id: answer.question_id,
              is_correct: Boolean(answer.is_correct),
              score: answer.score ?? 0,
            })),
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (attemptId) load();
  }, [attemptId]);

  return (
    <div className="min-h-screen bg-white">
      <Header
        title="MATHBANK"
        leftText="Back"
        leftAction={handleBack}
      />

      <main
        className={`w-full px-4 py-4 sm:px-6 lg:px-8 ${
          showMathSymbols ? "pb-44" : "pb-10"
        }`}
      >
        <section className="mb-5">
          <div>
            <h1 className="break-words text-2xl font-bold text-brand-primary">
              {classInfo || assignment ? (
                <>
                  {classInfo?.class_name ?? "Class"}{" "}
                  {assignment?.title && (
                    <>
                      <span className="font-medium text-gray-400">&bull;</span>{" "}
                      {assignment.title}
                    </>
                  )}
                </>
              ) : (
                "Student Assignment"
              )}
            </h1>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
            <div className="flex justify-end mr-2">
              {!isReadOnly && currentQuestion && (
                <Tooltip text="Turn in the assignment and lock your answers.">
                  <span>
                    <Button onClick={handleSubmitClick}>Submit</Button>
                  </span>
                </Tooltip>
              )}
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Tooltip text="Show or hide your rendered answer.">
                <span>
                  <Button
                    variant="ghost"
                    onClick={() => setShowPreview((v) => !v)}
                  >
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </Button>
                </span>
              </Tooltip>
            </div>
          </div>
        </section>

        {currentQuestion && (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
            <Panel className="min-w-0">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Question {currentIndex + 1}/{questions.length}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-brand-primary">
                    Question {currentIndex + 1}
                  </h2>
                </div>
                <span className="w-fit rounded-md border border-brand-borderSoft bg-brand-surface px-3 py-1 text-sm font-semibold text-brand-primary">
                  {currentQuestion.points} pts
                </span>
              </div>

              <div className="mb-4 rounded-md border border-brand-borderSoft bg-white px-4 py-3 text-brand-primary">
                <MathPreview
                  expression={currentQuestion.question_text}
                  compact
                  noBorder
                />
              </div>

              <div className="mb-4 rounded-md border border-status-infoBorder bg-status-infoBg p-3 text-sm text-status-infoText">
                <div className="mb-2 font-semibold">
                  How this question is graded
                </div>
                <div>{gradingGuidance}</div>
              </div>

              <label
                htmlFor="student-answer"
                className="mb-2 block font-semibold text-brand-primary"
              >
                Answer
              </label>
              <textarea
                id="student-answer"
                value={currentAnswer}
                onFocus={(event) => setActiveInput(event.currentTarget)}
                onChange={(event) =>
                  handleAnswerChange(currentQuestion.id, event.target.value)
                }
                disabled={isReadOnly}
                rows={7}
                className="w-full resize-y rounded-md border border-brand-primary bg-white px-3 py-2 text-brand-primary outline-none focus:ring-2 focus:ring-brand-borderSoft disabled:bg-white"
                placeholder={
                  isReadOnly
                    ? "Answer is read-only in review mode"
                    : "Enter your answer"
                }
              />
              {numericWarning && (
                <div className="mt-3">
                  <NumericWarning message="Enter a numeric value only, such as 8, 2/3, or 0.25." />
                </div>
              )}

              <MessageSlot message={message} />

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  onClick={() => setCurrentIndex((i) => i - 1)}
                  disabled={currentIndex === 0}
                >
                  Prev
                </Button>

                {!isReadOnly ? (
                  <Tooltip
                    text={
                      isChanged()
                        ? "Save your answers without submitting."
                        : "No answer changes to save yet."
                    }
                  >
                    <span>
                      <Button
                        onClick={handleSave}
                        disabled={!isChanged()}
                        variant="ghost"
                      >
                        Save Progress
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <div className="text-sm text-gray-500">
                    {isSubmitted ? "Submitted" : "Review mode"}
                  </div>
                )}

                <Button
                  onClick={() => setCurrentIndex((i) => i + 1)}
                  disabled={currentIndex === questions.length - 1}
                >
                  Next
                </Button>
              </div>

              {showReviewDetails && (
                <div className="mt-6 rounded-md border border-brand-borderSoft bg-brand-surface p-4 text-sm text-brand-primary">
                  <div>
                    <div className="mb-2 font-semibold">Your answer</div>
                    <div className="rounded-md border border-brand-borderSoft bg-white p-3">
                      <MathPreview
                        expression={currentAnswer}
                        compact
                        noBorder
                      />
                    </div>
                  </div>

                  {currentQuestion.correct_answer && (
                    <div className="mt-4">
                      <div className="mb-2 font-semibold">Correct answer</div>
                      <div className="rounded-md border border-brand-borderSoft bg-white p-3">
                        <MathPreview
                          expression={currentQuestion.correct_answer}
                          compact
                          noBorder
                        />
                      </div>
                    </div>
                  )}

                  <p className="mt-2">
                    <strong>Result:</strong>{" "}
                    {currentResult?.is_correct ? "✅ Correct" : "❌ Incorrect"}
                  </p>
                </div>
              )}
            </Panel>

            <aside className="min-w-0 space-y-4 lg:sticky lg:top-6 lg:h-fit">
              {showPreview && (
                <Panel className="bg-white p-4">
                  <div className="mb-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Preview
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-brand-primary">
                        Question {currentIndex + 1}
                      </h2>
                    </div>
                  </div>

                  <div className="rounded-md border border-brand-borderSoft bg-white p-3 text-brand-primary">
                    <MathPreview expression={currentAnswer} compact noBorder />
                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    {previewGradingMessage}
                  </p>
                </Panel>
              )}

              <Panel className="bg-white p-4">
                <h2 className="mb-3 text-lg font-bold text-brand-primary">
                  Questions
                </h2>
                <div className="grid max-h-[154px] grid-cols-5 gap-2 overflow-y-auto pr-1 sm:grid-cols-8">
                  {questions.map((question, index) => (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={`h-10 w-full rounded-md border text-sm font-semibold transition-colors ${getQuestionButtonClass(
                        question,
                        index,
                      )}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm border border-status-successBorder bg-status-successBg" />
                    Green = Answered
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm border border-status-infoBorder bg-status-infoBg" />
                    Blue = Current
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm border border-brand-borderSoft bg-brand-surface" />
                    Gray = Unanswered
                  </span>
                  {(showUnansweredWarning || isSubmitted) && (
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm border border-status-errorBorder bg-status-errorBg" />
                      Red = Needs answer
                    </span>
                  )}
                </div>
              </Panel>

              <Panel className="bg-white p-4">
                <h2 className="mb-3 text-lg font-bold text-brand-primary">
                  Information
                </h2>
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-500">Due Date</dt>
                    <dd className="min-w-0 break-words text-right font-semibold text-brand-primary">
                      {assignment?.due_date
                        ? formatDueDate(assignment.due_date)
                        : "No due date"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-gray-500">Total Score possible</dt>
                    <dd className="font-semibold text-brand-primary">
                      {formatNumber(totalPoints)}
                    </dd>
                  </div>
                  {submittedAt && (
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-gray-500">Submitted Date</dt>
                      <dd className="min-w-0 break-words text-right font-semibold text-brand-primary">
                        {formatDueDate(submittedAt)}
                      </dd>
                    </div>
                  )}
                  {hasStudentScore && (
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-gray-500">Student Score</dt>
                      <dd className="font-semibold text-brand-primary">
                        {formatNumber(result.total_score)} /{" "}
                        {formatNumber(totalPoints)}
                      </dd>
                    </div>
                  )}
                </dl>
              </Panel>
            </aside>
          </section>
        )}
      </main>

      <ConfirmModal
        open={showConfirm}
        title="Submit Assignment?"
        message={confirmMessage}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
      />

      <ConfirmModal
        open={showBackConfirm}
        title="Leave without saving?"
        message="Your latest answer changes have not been saved."
        onCancel={() => setShowBackConfirm(false)}
        onConfirm={() => navigate(-1)}
      />

      <FloatingMathToolbar
        showMathSymbols={showMathSymbols}
        activeInput={activeInput}
        activeField="answer"
        onQuestionChange={() => {}}
        onAnswerChange={handleToolbarAnswerChange}
        onShow={() => setShowMathSymbols(true)}
        onHide={() => setShowMathSymbols(false)}
      />
    </div>
  );
};

export default StudentAssignmentPage;
