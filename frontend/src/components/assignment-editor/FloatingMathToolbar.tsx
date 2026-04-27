import Button from "../Button";
import MathToolbar from "../MathToolbar";
import KeyboardIcon from "../icons/KeyboardIcon";

type Props = {
  showMathSymbols: boolean;
  activeInput: HTMLInputElement | HTMLTextAreaElement | null;
  activeField: "question" | "answer" | null;
  onQuestionChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
  onShow: () => void;
  onHide: () => void;
};

function FloatingMathToolbar({
  showMathSymbols,
  activeInput,
  activeField,
  onQuestionChange,
  onAnswerChange,
  onShow,
  onHide,
}: Props) {
  if (!showMathSymbols) {
    return (
      <button
        type="button"
        aria-label="Show math symbols keyboard"
        title="Show Math Symbols"
        onClick={onShow}
        className="fixed bottom-4 right-4 z-20 inline-flex h-14 w-14 items-center justify-center rounded-md bg-brand-primary text-white shadow-button transition-all duration-75 hover:bg-brand-primaryHover active:translate-y-[5px] active:shadow-buttonPressed"
      >
        <KeyboardIcon />
      </button>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-brand-primary bg-brand-surface shadow-lg">
      <div className="flex items-center justify-between gap-3 px-4 pt-3 sm:px-6 lg:px-8">
        <div className="text-sm font-semibold text-brand-primary">
          Insert Math Symbols
        </div>
        <Button variant="ghost" onClick={onHide}>
          Hide
        </Button>
      </div>
      <div className="px-2 sm:px-4 lg:px-6">
        <MathToolbar
          activeInput={activeInput}
          activeField={activeField}
          onQuestionChange={onQuestionChange}
          onAnswerChange={onAnswerChange}
        />
      </div>
    </div>
  );
}

export default FloatingMathToolbar;
