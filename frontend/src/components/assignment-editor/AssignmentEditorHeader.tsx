import Button from "../Button";

type Props = {
  classNameText: string;
  assignmentTitle: string;
  questionCount: number;
  showPreview: boolean;
  showQuestionList: boolean;
  showMathSymbols: boolean;
  onTogglePreview: () => void;
  onToggleQuestionList: () => void;
  onToggleMathSymbols: () => void;
};

function AssignmentEditorHeader({
  classNameText,
  assignmentTitle,
  questionCount,
  showPreview,
  showQuestionList,
  showMathSymbols,
  onTogglePreview,
  onToggleQuestionList,
  onToggleMathSymbols,
}: Props) {
  return (
    <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-brand-primary">
          {classNameText}{" "}
          <span className="font-medium text-gray-400">&bull;</span>{" "}
          {assignmentTitle}
        </h1>
        <div className="mt-2 text-sm text-gray-500">
          {questionCount} questions total
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={onTogglePreview}>
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
        <Button variant="ghost" onClick={onToggleQuestionList}>
          {showQuestionList ? "Hide Questions List" : "Show Questions List"}
        </Button>
        <Button variant="ghost" onClick={onToggleMathSymbols}>
          {showMathSymbols ? "Hide Math Symbols" : "Show Math Symbols"}
        </Button>
      </div>
    </section>
  );
}

export default AssignmentEditorHeader;
