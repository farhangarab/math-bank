import { useState } from "react";
import { insertAtCursor } from "../../utils/mathInsert";
import { templates } from "../../utils/mathTemplates";

type Props = {
  activeInput: HTMLInputElement | HTMLTextAreaElement | null;
  activeField: "question" | "answer" | null;
  onQuestionChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
};

const TABS = [
  "Basic",
  "Functions",
  "Trig",
  "Calculus",
  "Relations",
  "Greek",
] as const;
type Tab = (typeof TABS)[number];

function MathToolbar({
  activeInput,
  activeField,
  onQuestionChange,
  onAnswerChange,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Basic");

  function getOnChange() {
    if (activeField === "question") return onQuestionChange;
    if (activeField === "answer") return onAnswerChange;
    return null;
  }

  const insert = (text: string, cursorOffset: number) => {
    const onChange = getOnChange();
    if (!activeInput || !onChange) return;
    insertAtCursor(activeInput, { text, cursorOffset }, onChange);
  };

  const insertTemplate = (key: keyof typeof templates) => {
    const onChange = getOnChange();
    if (!activeInput || !onChange) return;
    insertAtCursor(activeInput, templates[key], onChange);
  };

  function insertSmartParens() {
    const onChange = getOnChange();
    if (!activeInput || !onChange) return;
    const start = activeInput.selectionStart || 0;
    const end = activeInput.selectionEnd || 0;
    const selected = activeInput.value.substring(start, end);
    insertAtCursor(
      activeInput,
      selected
        ? { text: `(${selected})`, cursorOffset: selected.length + 2 }
        : { text: "()", cursorOffset: 1 },
      onChange,
    );
  }

  return (
    <div className="px-4 pb-4 pt-3">
      <div className="mb-3 flex flex-wrap gap-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onMouseDown={(event) => {
              event.preventDefault();
              setActiveTab(tab);
            }}
            className={`
              rounded-full border px-3 py-1 text-xs font-medium transition-colors
              ${
                activeTab === tab
                  ? "border-brand-primary bg-brand-primary text-white"
                  : "border-brand-primary bg-transparent text-brand-primary hover:bg-brand-primary hover:text-white"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Buttons insert plain text only. Preview converts that text for display. */}
      <div className="flex flex-wrap gap-2">
        {activeTab === "Basic" && (
          <>
            <Btn label="+" onPress={() => insert("+", 1)} />
            <Btn label="-" onPress={() => insert("-", 1)} />
            <Btn label="×" onPress={() => insert("*", 1)} />
            <Btn label="÷" onPress={() => insert("/", 1)} />
            <Btn label="( )" onPress={insertSmartParens} />
            <Btn label="a/b" onPress={() => insertTemplate("fraction")} />
            <Btn label="π" onPress={() => insert("pi", 2)} />
            <Btn label="e" onPress={() => insert("e", 1)} />
            <Btn label="x²" onPress={() => insertTemplate("power2")} />
            <Btn label="xⁿ" onPress={() => insertTemplate("powern")} />
          </>
        )}

        {activeTab === "Functions" && (
          <>
            <Btn label="sqrt()" onPress={() => insertTemplate("sqrt")} />
            <Btn label="ln()" onPress={() => insertTemplate("ln")} />
            <Btn label="log()" onPress={() => insertTemplate("log")} />
            <Btn label="exp()" onPress={() => insertTemplate("exp")} />
            <Btn label="abs()" onPress={() => insertTemplate("abs")} />
          </>
        )}

        {activeTab === "Trig" && (
          <>
            <Btn label="sin()" onPress={() => insertTemplate("sin")} />
            <Btn label="cos()" onPress={() => insertTemplate("cos")} />
            <Btn label="tan()" onPress={() => insertTemplate("tan")} />
            <Btn label="sec()" onPress={() => insertTemplate("sec")} />
            <Btn label="csc()" onPress={() => insertTemplate("csc")} />
            <Btn label="cot()" onPress={() => insertTemplate("cot")} />
          </>
        )}

        {activeTab === "Calculus" && (
          <>
            <Btn label="∫ dx" onPress={() => insertTemplate("integral")} />
            <Btn label="d/dx" onPress={() => insertTemplate("derivative")} />
            <Btn label="lim" onPress={() => insertTemplate("limit")} />
            <Btn label="Σ" onPress={() => insertTemplate("sum")} />
          </>
        )}

        {activeTab === "Relations" && (
          <>
            <Btn label="=" onPress={() => insert("=", 1)} />
            <Btn label="≠" onPress={() => insert("!=", 2)} />
            <Btn label="<" onPress={() => insert("<", 1)} />
            <Btn label=">" onPress={() => insert(">", 1)} />
            <Btn label="≤" onPress={() => insert("<=", 2)} />
            <Btn label="≥" onPress={() => insert(">=", 2)} />
          </>
        )}

        {activeTab === "Greek" && (
          <>
            <Btn label="θ" onPress={() => insert("theta", 5)} />
            <Btn label="α" onPress={() => insert("alpha", 5)} />
            <Btn label="β" onPress={() => insert("beta", 4)} />
          </>
        )}
      </div>
    </div>
  );
}

function Btn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        onPress();
      }}
      className={`
        h-9 rounded-lg border px-3 text-sm transition-all active:scale-95
        border-brand-primary bg-white text-brand-primary hover:bg-brand-primary hover:text-white
      `}
    >
      {label}
    </button>
  );
}

export default MathToolbar;
