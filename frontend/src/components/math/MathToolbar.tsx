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

      {/* Buttons show math symbols but insert plain text for saving/grading. */}
      <div className="flex flex-wrap gap-2">
        {activeTab === "Basic" && (
          <>
            <Btn label="+" onPress={() => insert("+", 1)} />
            <Btn label="-" onPress={() => insert("-", 1)} />
            <Btn label={"\u00d7"} onPress={() => insert("*", 1)} />
            <Btn label={"\u00f7"} onPress={() => insert("/", 1)} />
            <Btn label="( )" onPress={insertSmartParens} />
            <Btn label="a/b" onPress={() => insertTemplate("fraction")} />
            <Btn label={"\u03c0"} onPress={() => insert("pi", 2)} />
            <Btn label="e" onPress={() => insert("e", 1)} />
            <Btn label={"x\u00b2"} onPress={() => insertTemplate("power2")} />
            <Btn label={"x\u207f"} onPress={() => insertTemplate("powern")} />
          </>
        )}

        {activeTab === "Functions" && (
          <>
            <Btn label={"\u221a()"} onPress={() => insertTemplate("sqrt")} />
            <Btn label="ln()" onPress={() => insertTemplate("ln")} />
            <Btn label="log()" onPress={() => insertTemplate("log")} />
            <Btn label={"e\u02e3"} onPress={() => insertTemplate("exp")} />
            <Btn label="|x|" onPress={() => insertTemplate("abs")} />
          </>
        )}

        {activeTab === "Trig" && (
          <>
            <Btn label="sin" onPress={() => insertTemplate("sin")} />
            <Btn label="cos" onPress={() => insertTemplate("cos")} />
            <Btn label="tan" onPress={() => insertTemplate("tan")} />
            <Btn label="sec" onPress={() => insertTemplate("sec")} />
            <Btn label="csc" onPress={() => insertTemplate("csc")} />
            <Btn label="cot" onPress={() => insertTemplate("cot")} />
          </>
        )}

        {activeTab === "Calculus" && (
          <>
            <Btn
              label={"\u222b dx"}
              title="Insert int(expression, variable)"
              onPress={() => insertTemplate("integral")}
            />
            <Btn
              label={"d/dx"}
              title="Insert derivative(expression, variable)"
              onPress={() => insertTemplate("derivative")}
            />
            <Btn
              label={"\u2192 lim"}
              title="Insert limit(variable, approach, expression)"
              onPress={() => insertTemplate("limit")}
            />
            <Btn
              label={"\u03a3"}
              title="Insert sum(index=start, end, expression)"
              onPress={() => insertTemplate("sum")}
            />
            <Btn
              label={"\u221e"}
              title="Insert infinity"
              onPress={() => insertTemplate("infinity")}
            />
          </>
        )}

        {activeTab === "Relations" && (
          <>
            <Btn label="=" onPress={() => insert("=", 1)} />
            <Btn label={"\u2260"} onPress={() => insert("!=", 2)} />
            <Btn label="<" onPress={() => insert("<", 1)} />
            <Btn label=">" onPress={() => insert(">", 1)} />
            <Btn label={"\u2264"} onPress={() => insert("<=", 2)} />
            <Btn label={"\u2265"} onPress={() => insert(">=", 2)} />
          </>
        )}

        {activeTab === "Greek" && (
          <>
            <Btn label={"\u03b8"} onPress={() => insert("theta", 5)} />
            <Btn label={"\u03b1"} onPress={() => insert("alpha", 5)} />
            <Btn label={"\u03b2"} onPress={() => insert("beta", 4)} />
          </>
        )}
      </div>
    </div>
  );
}

function Btn({
  label,
  title,
  onPress,
}: {
  label: string;
  title?: string;
  onPress: () => void;
}) {
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        onPress();
      }}
      title={title}
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
