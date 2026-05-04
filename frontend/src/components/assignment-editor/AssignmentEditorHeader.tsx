import Button from "../ui/Button";
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
    <section className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 md:flex-1">
        <h1 className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-2xl font-bold text-brand-primary">
          <span className="min-w-0 max-w-full truncate">{classNameText}</span>
          <span className="font-medium text-gray-400">&bull;</span>
          <span className="min-w-0 max-w-full truncate">{assignmentTitle}</span>
        </h1>
        <div className="mt-2 text-sm text-gray-500">
          Total questions: {questionCount}
        </div>
      </div>

      <div className="flex flex-row flex-wrap gap-2 md:shrink-0 md:justify-end">
        <Tooltip text="Show or hide the student view.">
          <span>
            <Button
              variant="ghost"
              className="whitespace-nowrap px-3 py-1.5 text-sm sm:px-4 sm:py-2"
              onClick={onTogglePreview}
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </span>
        </Tooltip>
        <Tooltip text="Show or hide saved questions.">
          <span>
            <Button
              variant="ghost"
              className="whitespace-nowrap px-3 py-1.5 text-sm sm:px-4 sm:py-2"
              onClick={onToggleQuestionList}
            >
              {showQuestionList ? "Hide Questions List" : "Show Questions List"}
            </Button>
          </span>
        </Tooltip>
      </div>
    </section>
  );
}

export default AssignmentEditorHeader;
