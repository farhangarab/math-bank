import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAssignmentById } from "../api/assignments";
import { getClassById } from "../api/classes";
import { createQuestion, getQuestions } from "../api/question";
import AssignmentEditorHeader from "../components/assignment-editor/AssignmentEditorHeader";
import FloatingMathToolbar from "../components/assignment-editor/FloatingMathToolbar";
import QuestionEditorForm from "../components/assignment-editor/QuestionEditorForm";
import StudentPreview from "../components/assignment-editor/StudentPreview";
import ConfirmModal from "../components/ConfirmModal";
import Header from "../components/Header";
import Panel from "../components/Panel";
import QuestionList from "../components/QuestionList";
import { useMessage } from "../hooks/useMessage";
import type { Assignment } from "../types/assignment";
import type { ClassInfo } from "../types/class";
import type { GradingType, Question } from "../types/question";
import { answerLooksNumeric } from "../utils/grading";
import { firstInvalid } from "../utils/validation";

function QuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [points, setPoints] = useState("0");
  const [gradingType, setGradingType] = useState<GradingType>("symbolic");
  const [requireSimplified, setRequireSimplified] = useState(false);

  const [showPreview, setShowPreview] = useState(true);
  const [showQuestionList, setShowQuestionList] = useState(true);
  const [showMathSymbols, setShowMathSymbols] = useState(true);
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  const [activeInput, setActiveInput] = useState<
    HTMLInputElement | HTMLTextAreaElement | null
  >(null);
  const [activeField, setActiveField] = useState<"question" | "answer" | null>(
    null,
  );

  const {
    message,
    fieldErrors,
    clearAllMessages,
    clearFieldError,
    showApiError,
    showFieldError,
    showSuccess,
  } = useMessage();

  useEffect(() => {
    let isCurrent = true;

    async function loadAssignmentEditor() {
      if (!id) return;
      const loadedAssignment = await getAssignmentById(Number(id));
      const loadedClass = await getClassById(loadedAssignment.class_id);
      const loadedQuestions = await getQuestions(loadedAssignment.id);

      if (!isCurrent) return;
      setAssignment(loadedAssignment);
      setClassInfo(loadedClass);
      setQuestions(loadedQuestions);
    }

    loadAssignmentEditor();

    return () => {
      isCurrent = false;
    };
  }, [id]);

  function resetQuestionForm() {
    clearAllMessages();
    setText("");
    setAnswer("");
    setPoints("0");
    setGradingType("symbolic");
    setRequireSimplified(false);
  }

  function hasUnsavedQuestion() {
    return text.trim() !== "" || answer.trim() !== "";
  }

  function handleBack() {
    if (hasUnsavedQuestion()) {
      setShowBackConfirm(true);
      return;
    }

    navigate(-1);
  }

  function setActiveEditorField(
    input: HTMLInputElement | HTMLTextAreaElement,
    field: "question" | "answer",
  ) {
    setActiveInput(input);
    setActiveField(field);
  }

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
        message: "Points cannot be negative.",
        isValid: Number(points) >= 0,
      },
    ]);

    if (invalid) {
      showFieldError(invalid.field, invalid.message);
      return;
    }

    try {
      const newQuestion = await createQuestion(
        Number(id),
        text,
        answer,
        questions.length + 1,
        Number(points),
        gradingType,
        requireSimplified,
      );

      setText("");
      setAnswer("");
      setPoints("0");
      setQuestions((currentQuestions) => [...currentQuestions, newQuestion]);
      showSuccess("Question created successfully.");
    } catch (error) {
      showApiError(error, "Failed to save question.");
    }
  }

  const nextQuestionNumber = questions.length + 1;
  const numericWarning =
    gradingType === "numeric" && answer.trim() && !answerLooksNumeric(answer);

  return (
    <div className="min-h-screen bg-white">
      <Header title="MATHBANK" leftText="Back" leftAction={handleBack} />

      <main
        className={`w-full px-4 py-6 sm:px-6 lg:px-8 ${
          showMathSymbols ? "pb-44" : "pb-10"
        }`}
      >
        <AssignmentEditorHeader
          classNameText={classInfo?.class_name ?? "Class"}
          assignmentTitle={assignment?.title ?? "Assignment"}
          questionCount={questions.length}
          showPreview={showPreview}
          showQuestionList={showQuestionList}
          onTogglePreview={() => setShowPreview((value) => !value)}
          onToggleQuestionList={() => setShowQuestionList((value) => !value)}
        />

        <section
          className={`grid gap-6 ${
            showPreview
              ? "lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)]"
              : ""
          }`}
        >
          <QuestionEditorForm
            questionNumber={nextQuestionNumber}
            text={text}
            answer={answer}
            points={points}
            gradingType={gradingType}
            requireSimplified={requireSimplified}
            numericWarning={numericWarning}
            message={message}
            fieldErrors={fieldErrors}
            onTextChange={setText}
            onAnswerChange={setAnswer}
            onPointsChange={setPoints}
            onGradingTypeChange={setGradingType}
            onRequireSimplifiedChange={setRequireSimplified}
            onActiveFieldChange={setActiveEditorField}
            onClearFieldError={clearFieldError}
            onClearAllMessages={clearAllMessages}
            onCancel={resetQuestionForm}
            onSave={handleAddQuestion}
          />

          {showPreview && (
            <StudentPreview
              questionNumber={nextQuestionNumber}
              questionText={text}
              answerText={answer}
              points={points}
              gradingType={gradingType}
              requireSimplified={requireSimplified}
              mode={activeField === "answer" ? "answer" : "student"}
            />
          )}
        </section>

        {showQuestionList && (
          <Panel className="mt-6">
            <h2 className="mb-4 text-xl font-bold text-brand-primary">
              Questions List ({questions.length})
            </h2>
            <QuestionList questions={questions} />
          </Panel>
        )}
      </main>

      <FloatingMathToolbar
        showMathSymbols={showMathSymbols}
        activeInput={activeInput}
        activeField={activeField}
        onQuestionChange={setText}
        onAnswerChange={setAnswer}
        onShow={() => setShowMathSymbols(true)}
        onHide={() => setShowMathSymbols(false)}
      />

      <ConfirmModal
        open={showBackConfirm}
        title="Leave without saving?"
        message="Unsaved question changes will be lost."
        onCancel={() => setShowBackConfirm(false)}
        onConfirm={() => navigate(-1)}
      />
    </div>
  );
}

export default QuestionPage;
