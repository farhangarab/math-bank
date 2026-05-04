import { InlineMath } from "react-katex";
import { toLatex } from "../../utils/toLatex";

type Part = { type: "text" | "math"; value: string };

const KNOWN_WORDS = new Set([
  "sqrt",
  "sin",
  "cos",
  "tan",
  "sec",
  "csc",
  "cot",
  "ln",
  "log",
  "exp",
  "abs",
  "sum",
  "int",
  "lim",
  "integrate",
  "limit",
  "pi",
  "theta",
  "alpha",
  "beta",
]);

const MATH_SNIPPET =
  /(?:\b(?:sqrt|sin|cos|tan|sec|csc|cot|ln|log|exp|abs|sum|int|lim|integrate|limit)\([^)]*\))|(?:\([^()]+\)\/\([^()]+\))|(?:\b[a-zA-Z0-9]+\/[a-zA-Z0-9]+\b)|(?:\b[a-zA-Z0-9]+\^\(?[a-zA-Z0-9]+\)?)|(?:\b[a-zA-Z0-9]+ *(?:<=|>=|!=|=|<|>) *[a-zA-Z0-9]+\b)|(?:\bpi\b|π|\btheta\b|\balpha\b|\bbeta\b)|(?:\d+ *\* *[a-zA-Z0-9]+|[a-zA-Z0-9]+ *\* *\d+)/g;

type Props = {
  expression: string;
  noBorder?: boolean;
  compact?: boolean;
  singleLine?: boolean;
};

function hasNaturalLanguage(expression: string) {
  const words = expression.match(/[a-zA-Z]+/g) ?? [];

  return words.some((word) => word.length > 1 && !KNOWN_WORDS.has(word));
}

function splitMixedText(expression: string): Part[] {
  const parts: Part[] = [];
  let lastIndex = 0;

  for (const match of expression.matchAll(MATH_SNIPPET)) {
    const index = match.index ?? 0;

    if (index > lastIndex) {
      parts.push({ type: "text", value: expression.slice(lastIndex, index) });
    }

    parts.push({ type: "math", value: match[0] });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < expression.length) {
    parts.push({ type: "text", value: expression.slice(lastIndex) });
  }

  return parts;
}

function SafeMath({ expression }: { expression: string }) {
  return (
    <InlineMath
      math={toLatex(expression)}
      renderError={() => <span>{expression}</span>}
    />
  );
}

function MathPreview({ expression, noBorder, compact, singleLine }: Props) {
  if (!expression) {
    return <div className="text-gray-400">Nothing to preview</div>;
  }

  const parts = hasNaturalLanguage(expression)
    ? splitMixedText(expression)
    : [{ type: "math", value: expression } satisfies Part];

  return (
    <div
      className={`
        min-w-0 bg-transparent text-brand-primary
        ${
          singleLine
            ? "overflow-hidden text-ellipsis whitespace-nowrap"
            : "overflow-x-auto whitespace-pre-wrap break-words"
        }
        ${compact ? "min-h-0" : "mt-1 min-h-[32px] pt-2"}
        ${noBorder ? "" : "border-t border-dashed border-gray-200"}
      `}
    >
      {parts.map((part, index) =>
        part.type === "math" ? (
          <SafeMath key={index} expression={part.value} />
        ) : (
          <span key={index}>{part.value}</span>
        ),
      )}
    </div>
  );
}

export default MathPreview;
