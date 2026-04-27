import Button from "../Button";
import MessageSlot from "../MessageSlot";
import Panel from "../Panel";
import NumericWarning from "./NumericWarning";
import type { GradingType } from "../../types/question";
import type { MessageState } from "../../hooks/useMessage";

type Props = {
  questionNumber: number;
  text: string;
  answer: string;
  points: string;
  gradingType: GradingType;
  requireSimplified: boolean;
  numericWarning: boolean | string;
  message: MessageState | null;
  fieldErrors: Record<string, string>;
  onTextChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
  onPointsChange: (value: string) => void;
  onGradingTypeChange: (value: GradingType) => void;
  onRequireSimplifiedChange: (value: boolean) => void;
  onActiveFieldChange: (
    input: HTMLInputElement | HTMLTextAreaElement,
    field: "question" | "answer",
  ) => void;
  onClearFieldError: (field: string) => void;
  onClearAllMessages: () => void;
  onCancel: () => void;
  onSave: () => void;
};

function QuestionEditorForm({
  questionNumber,
  text,
  answer,
  points,
  gradingType,
  requireSimplified,
  numericWarning,
  message,
  fieldErrors,
  onTextChange,
  onAnswerChange,
  onPointsChange,
  onGradingTypeChange,
  onRequireSimplifiedChange,
  onActiveFieldChange,
  onClearFieldError,
  onClearAllMessages,
  onCancel,
  onSave,
}: Props) {
  return (
    <Panel className="flex min-w-0 flex-col p-0">
      <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 sm:pt-2">
        <div className="mb-1">
          <h2 className="text-2xl font-bold text-brand-primary">
            Question {questionNumber}
          </h2>
        </div>

        <div className="space-y-3">
          <div>
            <label
              htmlFor="question-input"
              className="mb-2 block font-medium text-brand-primary"
            >
              Enter the Question
            </label>
            <textarea
              id="question-input"
              onFocus={(event) => onActiveFieldChange(event.target, "question")}
              placeholder="Write your question..."
              value={text}
              onChange={(event) => {
                onTextChange(event.target.value);
                onClearFieldError("question_text");
              }}
              aria-invalid={Boolean(fieldErrors.question_text)}
              className={`min-h-[110px] w-full rounded-md border p-3 text-brand-primary focus:outline-none ${
                fieldErrors.question_text
                  ? "border-status-errorText bg-status-errorBg"
                  : "border-brand-primary bg-white"
              }`}
            />
            {fieldErrors.question_text && (
              <p className="mt-1 text-sm text-status-errorText">
                {fieldErrors.question_text}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="question-type"
                className="mb-2 block font-medium text-brand-primary"
              >
                Question Type
              </label>
              <select
                id="question-type"
                value={gradingType}
                onChange={(event) => {
                  onClearAllMessages();
                  onGradingTypeChange(event.target.value as GradingType);
                  if (event.target.value !== "symbolic") {
                    onRequireSimplifiedChange(false);
                  }
                }}
                className="w-full rounded-md border border-brand-primary bg-white p-3 text-brand-primary focus:outline-none"
              >
                <option value="exact">Exact</option>
                <option value="symbolic">Symbolic</option>
                <option value="numeric">Numeric</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="points-input"
                className="mb-2 block font-medium text-brand-primary"
              >
                Points
              </label>
              <input
                id="points-input"
                type="number"
                min="0"
                placeholder="Points"
                value={points}
                onChange={(event) => {
                  onPointsChange(event.target.value);
                  onClearFieldError("points");
                }}
                aria-invalid={Boolean(fieldErrors.points)}
                className={`w-full rounded-md border p-3 text-brand-primary focus:outline-none ${
                  fieldErrors.points
                    ? "border-status-errorText bg-status-errorBg"
                    : "border-brand-primary bg-white"
                }`}
              />
              {fieldErrors.points && (
                <p className="mt-1 text-sm text-status-errorText">
                  {fieldErrors.points}
                </p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 text-brand-primary">
            <input
              type="checkbox"
              checked={requireSimplified}
              disabled={gradingType !== "symbolic"}
              onChange={(event) =>
                onRequireSimplifiedChange(event.target.checked)
              }
              className="h-4 w-4"
            />
            Require Simplified Form
          </label>

          {numericWarning && <NumericWarning />}

          <div>
            <label
              htmlFor="answer-input"
              className="mb-2 block font-medium text-brand-primary"
            >
              Correct Answer
            </label>
            <textarea
              id="answer-input"
              onFocus={(event) => onActiveFieldChange(event.target, "answer")}
              placeholder="Correct answer (e.g., 4*x)"
              value={answer}
              onChange={(event) => {
                onAnswerChange(event.target.value);
                onClearFieldError("correct_answer");
              }}
              aria-invalid={Boolean(fieldErrors.correct_answer)}
              className={`min-h-[80px] w-full rounded-md border p-3 text-brand-primary focus:outline-none ${
                fieldErrors.correct_answer
                  ? "border-status-errorText bg-status-errorBg"
                  : "border-brand-primary bg-white"
              }`}
            />
            {fieldErrors.correct_answer && (
              <p className="mt-1 text-sm text-status-errorText">
                {fieldErrors.correct_answer}
              </p>
            )}
          </div>

          <MessageSlot message={message} />

          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onSave}>Save Question</Button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default QuestionEditorForm;
