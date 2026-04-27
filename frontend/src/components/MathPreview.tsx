import { InlineMath } from "react-katex";
import { toLatex } from "../utils/toLatex";

type Part = { type: "text" | "math"; value: string };

const KEYWORDS = [
  "integrate(",
  "limit(",
  "sqrt(",
  "sin(",
  "cos(",
  "tan(",
  "log(",
  "ln(",
];

const OPEN_CLOSE: Record<string, string> = {
  "(": ")",
  "[": "]",
};

function findMatchingBracket(str: string, openPos: number): number {
  const closeChar = OPEN_CLOSE[str[openPos]];
  if (!closeChar) return -1;
  let depth = 0;
  for (let i = openPos; i < str.length; i++) {
    if (str[i] === str[openPos]) depth++;
    else if (str[i] === closeChar) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function splitTextAndMath(input: string): Part[] {
  const parts: Part[] = [];
  let i = 0;
  let textStart = 0;

  while (i < input.length) {
    // 1. word^exp — e.g. x^2, x^n
    const powerMatch = /^([a-zA-Z0-9]+)\^(\d+|[a-zA-Z])/.exec(input.slice(i));
    if (powerMatch) {
      if (i > textStart)
        parts.push({ type: "text", value: input.slice(textStart, i) });
      parts.push({ type: "math", value: powerMatch[0] });
      i += powerMatch[0].length;
      textStart = i;
      continue;
    }

    // 2. (expr)^exp or [expr]^exp — e.g. (x+1)^2, [limit(...)]^2
    if (input[i] === "(" || input[i] === "[") {
      const closePos = findMatchingBracket(input, i);
      if (closePos !== -1) {
        const expMatch = /^\^(\d+|[a-zA-Z])/.exec(input.slice(closePos + 1));
        if (expMatch) {
          if (i > textStart)
            parts.push({ type: "text", value: input.slice(textStart, i) });
          parts.push({
            type: "math",
            value: input.slice(i, closePos + 1 + expMatch[0].length),
          });
          i = closePos + 1 + expMatch[0].length;
          textStart = i;
          continue;
        }
      }
    }

    // 3. known keywords — walk to balanced closing bracket,
    //    then also consume a trailing ^exp if present (e.g. log(x)^5)
    let matched = false;
    for (const kw of KEYWORDS) {
      if (input.startsWith(kw, i)) {
        const openPos = i + kw.length - 1;
        const closePos = findMatchingBracket(input, openPos);
        let end = closePos === -1 ? input.length : closePos + 1;

        // ← the fix: grab ^exp after the closing bracket too
        const expMatch = /^\^(\d+|[a-zA-Z])/.exec(input.slice(end));
        if (expMatch) end += expMatch[0].length;

        if (i > textStart)
          parts.push({ type: "text", value: input.slice(textStart, i) });
        parts.push({ type: "math", value: input.slice(i, end) });
        i = end;
        textStart = i;
        matched = true;
        break;
      }
    }

    if (!matched) i++;
  }

  if (textStart < input.length) {
    parts.push({ type: "text", value: input.slice(textStart) });
  }

  return parts;
}

type Props = {
  expression: string;
  noBorder?: boolean;
  compact?: boolean;
};

function MathPreview({ expression, noBorder, compact }: Props) {
  if (!expression) {
    return <div className="text-gray-400">Nothing to preview</div>;
  }

  const parts = splitTextAndMath(expression);

  return (
    <div
      className={`
    bg-transparent text-brand-primary whitespace-pre-wrap
    ${compact ? "min-h-0" : "pt-2 mt-1 min-h-[32px]"}
    ${noBorder ? "" : "border-t border-dashed border-gray-200"}
  `}
    >
      {parts.map((part, i) =>
        part.type === "math" ? (
          <InlineMath key={i} math={toLatex(part.value)} />
        ) : (
          <span key={i}>{part.value}</span>
        ),
      )}
    </div>
  );
}

export default MathPreview;
