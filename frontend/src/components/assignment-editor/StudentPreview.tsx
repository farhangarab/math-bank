import MathPreview from "../MathPreview";
import Panel from "../Panel";
import type { GradingType } from "../../types/question";
import { getStudentGuidance } from "../../utils/grading";

type Props = {
  questionNumber: number;
  questionText: string;
  answerText: string;
  points: string;
  gradingType: GradingType;
  requireSimplified: boolean;
  mode: "student" | "answer";
};

function StudentPreview({
  questionNumber,
  questionText,
  answerText,
  points,
  gradingType,
  requireSimplified,
  mode,
}: Props) {
  const guidance = getStudentGuidance(gradingType, requireSimplified);
  const showSymbolicNote = gradingType === "symbolic";
  const isAnswerMode = mode === "answer";

  return (
    <Panel className="h-fit min-w-0 bg-white p-4 lg:sticky lg:top-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {isAnswerMode ? "Correct Answer Preview" : "Student Preview"}
          </p>
          {!isAnswerMode && (
            <h2 className="mt-1 text-xl font-bold text-brand-primary">
              Question {questionNumber}
            </h2>
          )}
        </div>
        {!isAnswerMode && (
          <span className="rounded-md border border-brand-borderSoft bg-white px-2 py-1 text-sm font-semibold text-brand-primary">
            {Number(points) || 0} pts
          </span>
        )}
      </div>

      <div className="rounded-md border border-brand-borderSoft bg-white p-3">
        <div className="text-brand-primary">
          <MathPreview
            expression={isAnswerMode ? answerText : questionText}
            compact={isAnswerMode}
            noBorder
          />
        </div>
      </div>

      {isAnswerMode && (
        <p className="mt-3 text-sm text-gray-500">
          This is the answer key MathBank will check against student responses
          when scoring.
        </p>
      )}

      {!isAnswerMode && showSymbolicNote && (
        <div className="mt-4 rounded-md border border-status-infoBorder bg-status-infoBg px-3 py-2 text-sm font-medium text-status-infoText">
          Symbolic grading accepts equivalent answers.
        </div>
      )}

      {!isAnswerMode && (
        <p className="mt-3 text-sm text-gray-500">{guidance}</p>
      )}
    </Panel>
  );
}

export default StudentPreview;
