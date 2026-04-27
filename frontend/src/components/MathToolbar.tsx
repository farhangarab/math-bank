import { useState } from "react";
import { insertAtCursor } from "../utils/mathInsert";
import { templates } from "../utils/mathTemplates";

type Props = {
  activeInput: HTMLInputElement | HTMLTextAreaElement | null;
  activeField: "question" | "answer" | null;
  onQuestionChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
};

const TABS = ["Basic", "Functions", "Trig", "Calculus"] as const;
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
    <div className="px-4 pt-3 pb-4">
      {/* Tab strip */}
      <div className="flex gap-1 mb-3">
        {TABS.map((tab) => (
          <button
            key={tab}
            onMouseDown={(e) => {
              e.preventDefault();
              setActiveTab(tab);
            }}
            className={`
              text-xs font-medium px-3 py-1 rounded-full border transition-colors
              ${
            activeTab === tab
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-transparent text-brand-primary border-brand-primary hover:bg-brand-primary hover:text-white"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Button row — only active tab shown, fixed single row height */}
      <div className="flex flex-wrap gap-2">
        {activeTab === "Basic" && (
          <>
            <Btn label="+" onPress={() => insert("+", 1)} />
            <Btn label="−" onPress={() => insert("-", 1)} />
            <Btn label="×" onPress={() => insert("*", 1)} />
            <Btn label="÷" onPress={() => insert("/", 1)} />
            <Btn label="( )" onPress={() => insertSmartParens()} />
            <Btn label="a/b" onPress={() => insertTemplate("fraction")} />
            <Btn label="π" onPress={() => insert("pi", 2)} />
            <Btn label="x²" onPress={() => insert("^2", 2)} />
            <Btn label="xⁿ" onPress={() => insert("^", 1)} />
          </>
        )}

        {activeTab === "Functions" && (
          <>
            <Btn label="log()" onPress={() => insertTemplate("log")} />
            <Btn label="ln()" onPress={() => insert("ln()", 3)} />
            <Btn label="√" onPress={() => insert("sqrt()", 5)} />
          </>
        )}

        {activeTab === "Trig" && (
          <>
            <Btn label="sin()" onPress={() => insertTemplate("sin")} />
            <Btn label="cos()" onPress={() => insert("cos()", 4)} />
            <Btn label="tan()" onPress={() => insert("tan()", 4)} />
          </>
        )}

        {activeTab === "Calculus" && (
          <>
            <Btn label="∫ dx" onPress={() => insertTemplate("integral")} />
            <Btn label="lim" onPress={() => insertTemplate("limit")} />
            <Btn label="Σ" onPress={() => insert("sum( , (n,1,10))", 5)} />
          </>
        )}
      </div>
    </div>
  );
}

function Btn({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onPress();
      }}
      className={`
        h-9 px-3 rounded-lg border text-sm transition-all active:scale-95
        bg-white text-brand-primary border-brand-primary hover:bg-brand-primary hover:text-white
      `}
    >
      {label}
    </button>
  );
}

export default MathToolbar;
