import Button from "../Button";
import Tooltip from "../ui/Tooltip";

type Props = {
  classNameText: string;
  assignmentTitle: string;
  questionCount: number;
  showPreview: boolean;
  showQuestionList: boolean;
  onTogglePreview: () => void;
  onToggleQuestionList: () => void;
};

function AssignmentEditorHeader({
  classNameText,
  assignmentTitle,
  questionCount,
  showPreview,
  showQuestionList,
  onTogglePreview,
  onToggleQuestionList,
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
          Total questions: {questionCount}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Tooltip text="Show or hide the student view.">
          <span>
            <Button variant="ghost" onClick={onTogglePreview}>
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </span>
        </Tooltip>
        <Tooltip text="Show or hide saved questions.">
          <span>
            <Button variant="ghost" onClick={onToggleQuestionList}>
              {showQuestionList ? "Hide Questions List" : "Show Questions List"}
            </Button>
          </span>
        </Tooltip>
      </div>
    </section>
  );
}

export default AssignmentEditorHeader;
