import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAssignmentById } from "../api/assignments";
import { getClassById } from "../api/classes";
import {
  createQuestion,
  deleteQuestion,
  getQuestions,
  updateQuestion,
} from "../api/question";
import AssignmentEditorHeader from "../components/assignment-editor/AssignmentEditorHeader";
import FloatingMathToolbar from "../components/assignment-editor/FloatingMathToolbar";
import QuestionEditorForm from "../components/assignment-editor/QuestionEditorForm";
import StudentPreview from "../components/assignment-editor/StudentPreview";
import ConfirmModal from "../components/ConfirmModal";
import Header from "../components/Header";
import MessageSlot from "../components/MessageSlot";
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
  const editorSectionRef = useRef<HTMLElement | null>(null);

  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [points, setPoints] = useState("0");
  const [gradingType, setGradingType] = useState<GradingType>("symbolic");
  const [requireSimplified, setRequireSimplified] = useState(false);

  const [showPreview, setShowPreview] = useState(true);
  const [showQuestionList, setShowQuestionList] = useState(true);
  const [showMathSymbols, setShowMathSymbols] = useState(true);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(
    null,
  );
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

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
  const {
    message: questionListMessage,
    clearAllMessages: clearQuestionListMessages,
    showApiError: showQuestionListApiError,
    showSuccess: showQuestionListSuccess,
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

  function clearQuestionForm() {
    clearAllMessages();
    setText("");
    setAnswer("");
    setPoints("0");
    setGradingType("symbolic");
    setRequireSimplified(false);
  }

  function loadQuestionIntoForm(question: Question) {
    clearAllMessages();
    clearQuestionListMessages();
    setEditingQuestion(question);
    setText(question.question_text);
    setAnswer(question.correct_answer ?? "");
    setPoints(String(question.points));
    setGradingType(question.grading_type);
    setRequireSimplified(question.require_simplified);
    editorSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function cancelEditMode() {
    setEditingQuestion(null);
    clearQuestionForm();
  }

  function resetQuestionForm() {
    if (!editingQuestion) {
      clearQuestionForm();
      return;
    }

    clearAllMessages();
    setText(editingQuestion.question_text);
    setAnswer(editingQuestion.correct_answer ?? "");
    setPoints(String(editingQuestion.points));
    setGradingType(editingQuestion.grading_type);
    setRequireSimplified(editingQuestion.require_simplified);
  }

  function normalizedFormData() {
    return {
      question_text: text.trim(),
      correct_answer: answer.trim(),
      points: points.trim(),
      grading_type: gradingType,
      require_simplified: requireSimplified,
    };
  }

  function normalizedQuestionData(question: Question) {
    return {
      question_text: question.question_text.trim(),
      correct_answer: (question.correct_answer ?? "").trim(),
      points: String(question.points).trim(),
      grading_type: question.grading_type,
      require_simplified: question.require_simplified,
    };
  }

  function hasEditChanges() {
    if (!editingQuestion) return false;

    const current = normalizedFormData();
    const original = normalizedQuestionData(editingQuestion);

    return (
      current.question_text !== original.question_text ||
      current.correct_answer !== original.correct_answer ||
      current.points !== original.points ||
      current.grading_type !== original.grading_type ||
      current.require_simplified !== original.require_simplified
    );
  }

  function hasUnsavedQuestion() {
    if (editingQuestion) return hasEditChanges();

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
    clearQuestionListMessages();

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
        message: "Points are required.",
        isValid: points.trim() !== "",
      },
      {
        field: "points",
        message: "Points cannot be negative.",
        isValid: points.trim() !== "" && Number(points) >= 0,
      },
    ]);

    if (invalid) {
      showFieldError(invalid.field, invalid.message);
      return;
    }

    try {
      const newQuestion = await createQuestion(
        Number(id),
        text.trim(),
        answer.trim(),
        questions.length + 1,
        Number(points),
        gradingType,
        requireSimplified,
      );

      clearQuestionForm();
      setQuestions((currentQuestions) => [...currentQuestions, newQuestion]);
      showSuccess("Question created successfully.");
    } catch (error) {
      showApiError(error, "Failed to save question.");
    }
  }

  async function handleUpdateQuestion() {
    if (!editingQuestion || !hasEditChanges()) return;

    clearAllMessages();
    clearQuestionListMessages();

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
        message: "Points are required.",
        isValid: points.trim() !== "",
      },
      {
        field: "points",
        message: "Points cannot be negative.",
        isValid: points.trim() !== "" && Number(points) >= 0,
      },
    ]);

    if (invalid) {
      showFieldError(invalid.field, invalid.message);
      return;
    }

    try {
      const updatedQuestion = await updateQuestion(
        editingQuestion.id,
        text.trim(),
        answer.trim(),
        Number(points),
        gradingType,
        requireSimplified,
      );

      setQuestions((currentQuestions) =>
        currentQuestions.map((question) =>
          question.id === updatedQuestion.id ? updatedQuestion : question,
        ),
      );
      setEditingQuestion(null);
      clearQuestionForm();
      showSuccess("Question updated successfully.");
    } catch (error) {
      showApiError(error, "Failed to update question.");
    }
  }

  async function handleConfirmDeleteQuestion() {
    if (!questionToDelete) return;

    clearAllMessages();
    clearQuestionListMessages();

    try {
      await deleteQuestion(questionToDelete.id);
      setQuestions((currentQuestions) =>
        currentQuestions.filter(
          (question) => question.id !== questionToDelete.id,
        ),
      );
      if (editingQuestion?.id === questionToDelete.id) {
        setEditingQuestion(null);
        clearQuestionForm();
      }
      setQuestionToDelete(null);
      showQuestionListSuccess("Question deleted successfully.");
    } catch (error) {
      setQuestionToDelete(null);
      showQuestionListApiError(error, "Failed to delete question.");
    }
  }

  const nextQuestionNumber = questions.length + 1;
  const editingQuestionIndex = editingQuestion
    ? questions.findIndex((question) => question.id === editingQuestion.id)
    : -1;
  const currentQuestionNumber =
    editingQuestionIndex >= 0 ? editingQuestionIndex + 1 : nextQuestionNumber;
  const isEditing = Boolean(editingQuestion);
  const editHasChanges = hasEditChanges();
  const numericWarning =
    gradingType === "numeric" && answer.trim() && !answerLooksNumeric(answer);

  return (
    <div className="min-h-screen bg-white">
      <Header title="MATHBANK" leftText="Back" leftAction={handleBack} />

      <main
        className="w-full px-4 py-6 sm:px-6 lg:px-8"
        style={{
          paddingBottom: showMathSymbols
            ? "var(--math-toolbar-space, 22rem)"
            : "7rem",
        }}
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
          ref={editorSectionRef}
          className={`grid gap-6 ${
            showPreview
              ? "lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)]"
              : ""
          }`}
        >
          <QuestionEditorForm
            questionNumber={currentQuestionNumber}
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
            onReset={resetQuestionForm}
            onCancelEdit={cancelEditMode}
            onSave={isEditing ? handleUpdateQuestion : handleAddQuestion}
            isEditing={isEditing}
            hasEditChanges={editHasChanges}
          />

          {showPreview && (
            <StudentPreview
              questionNumber={currentQuestionNumber}
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
            <MessageSlot message={questionListMessage} />
            <QuestionList
              questions={questions}
              onEditQuestion={loadQuestionIntoForm}
              onDeleteQuestion={setQuestionToDelete}
            />
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

      <ConfirmModal
        open={Boolean(questionToDelete)}
        title="Delete question?"
        message="Are you sure you want to delete this question?"
        onCancel={() => setQuestionToDelete(null)}
        onConfirm={handleConfirmDeleteQuestion}
        confirmText="Delete"
      />
    </div>
  );
}

export default QuestionPage;
