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
  "derivative",
  "sum",
  "int",
  "lim",
  "integrate",
  "limit",
  "pi",
  "theta",
  "alpha",
  "beta",
  "infinity",
  "inf",
]);

const FUNCTION_NAMES = [
  "integrate",
  "limit",
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
  "derivative",
  "sum",
  "int",
  "lim",
];

const COMPACT_FUNCTION_NAMES = [
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
];

const COMPACT_CONSTANTS = ["pi", "theta", "alpha", "beta", "infinity", "inf"];

const COMPACT_WORD_BLOCKLIST = [
  "sine",
  "cosine",
  "tangent",
  "secant",
  "cosecant",
  "cotangent",
  "logarithm",
  "exponential",
  "absolute",
];

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

function findClosingParen(expression: string, openIndex: number) {
  let depth = 0;

  for (let index = openIndex; index < expression.length; index++) {
    if (expression[index] === "(") depth++;
    if (expression[index] === ")") depth--;
    if (depth === 0) return index;
  }

  return -1;
}

function readSimpleMathToken(expression: string, start: number) {
  let index = start;

  while (index < expression.length && /[a-zA-Z0-9]/.test(expression[index])) {
    index++;
  }

  return index;
}

function readExponentEnd(expression: string, caretIndex: number) {
  const start = caretIndex + 1;

  if (expression[start] === "(") {
    const closeIndex = findClosingParen(expression, start);
    return closeIndex === -1 ? start : closeIndex + 1;
  }

  return readSimpleMathToken(expression, start);
}

function readPowerChainEnd(expression: string, start: number) {
  let end = start;

  while (expression[end] === "^") {
    const exponentEnd = readExponentEnd(expression, end);
    if (exponentEnd <= end + 1) break;
    end = exponentEnd;
  }

  return end;
}

function startsFunctionAt(expression: string, index: number) {
  return FUNCTION_NAMES.find(
    (name) =>
      expression.startsWith(name, index) &&
      !/[a-zA-Z]/.test(expression[index - 1] ?? "") &&
      expression[index + name.length] === "(",
  );
}

function startsCompactFunctionAt(expression: string, index: number) {
  const blockedWord = COMPACT_WORD_BLOCKLIST.find(
    (word) =>
      expression.startsWith(word, index) &&
      !/[a-zA-Z0-9]/.test(expression[index + word.length] ?? ""),
  );

  if (blockedWord) return undefined;

  return COMPACT_FUNCTION_NAMES.find(
    (name) =>
      expression.startsWith(name, index) &&
      !/[a-zA-Z]/.test(expression[index - 1] ?? "") &&
      expression[index + name.length] !== "(",
  );
}

function readCompactArgumentEnd(expression: string, start: number) {
  if (/\d/.test(expression[start] ?? "")) {
    let end = start;

    while (end < expression.length && /[\d.]/.test(expression[end])) end++;

    return end;
  }

  if (!/[a-zA-Z]/.test(expression[start] ?? "")) return -1;

  let end = start;
  while (end < expression.length && /[a-zA-Z0-9]/.test(expression[end])) {
    end++;
  }

  const token = expression.slice(start, end);
  const nestedFunction = COMPACT_FUNCTION_NAMES.find((name) =>
    token.startsWith(name),
  );

  // Keep this conservative so regular words around math stay as text.
  if (
    token.length === 1 ||
    /^[a-zA-Z]\d+$/.test(token) ||
    COMPACT_CONSTANTS.includes(token) ||
    nestedFunction
  ) {
    return end;
  }

  return -1;
}

function readCompactFunctionSnippetEnd(expression: string, index: number) {
  const name = startsCompactFunctionAt(expression, index);
  if (!name) return -1;

  const argumentEnd = readCompactArgumentEnd(expression, index + name.length);
  if (argumentEnd === -1) return -1;

  return readPowerChainEnd(expression, argumentEnd);
}

function readFunctionSnippetEnd(expression: string, index: number) {
  const name = startsFunctionAt(expression, index);
  if (!name) return -1;

  const openIndex = index + name.length;
  const closeIndex = findClosingParen(expression, openIndex);
  if (closeIndex === -1) return -1;

  return readPowerChainEnd(expression, closeIndex + 1);
}

function groupLooksMath(expression: string) {
  const trimmed = expression.trim();

  if (!trimmed) return false;
  if (/^[a-zA-Z0-9]$/.test(trimmed)) return true;
  if (/[+\-*/^]|<=|>=|!=|=|<|>/.test(trimmed)) return true;
  if (COMPACT_CONSTANTS.includes(trimmed)) return true;

  return [...FUNCTION_NAMES, ...COMPACT_FUNCTION_NAMES].some(
    (name) =>
      trimmed.startsWith(`${name}(`) ||
      trimmed.startsWith(name) ||
      trimmed.includes(`${name}(`),
  );
}

function readGroupedSnippetEnd(expression: string, index: number) {
  if (expression[index] !== "(") return -1;

  const closeIndex = findClosingParen(expression, index);
  if (closeIndex === -1) return -1;

  const afterGroup = closeIndex + 1;

  if (groupLooksMath(expression.slice(index + 1, closeIndex))) {
    if (expression[afterGroup] === "^") {
      return readPowerChainEnd(expression, afterGroup);
    }

    return afterGroup;
  }

  if (expression[afterGroup] !== "^" && expression[afterGroup] !== "/") {
    return -1;
  }

  if (expression[afterGroup] === "^") {
    return readPowerChainEnd(expression, afterGroup);
  }

  if (expression[afterGroup + 1] === "(") {
    const rightClose = findClosingParen(expression, afterGroup + 1);
    return rightClose === -1 ? -1 : rightClose + 1;
  }

  const rightEnd = readSimpleMathToken(expression, afterGroup + 1);
  return rightEnd > afterGroup + 1 ? rightEnd : -1;
}

function readTokenSnippetEnd(expression: string, index: number) {
  const tokenEnd = readSimpleMathToken(expression, index);
  const token = expression.slice(index, tokenEnd);

  if (!token) return -1;
  if (["pi", "theta", "alpha", "beta", "infinity", "inf"].includes(token)) {
    return tokenEnd;
  }

  if (expression[tokenEnd] === "^") {
    return readPowerChainEnd(expression, tokenEnd);
  }

  if (expression[tokenEnd] === "/" || expression[tokenEnd] === "*") {
    const nextEnd = readSimpleMathToken(expression, tokenEnd + 1);
    return nextEnd > tokenEnd + 1 ? nextEnd : -1;
  }

  const afterToken = expression.slice(tokenEnd);
  const spaces = afterToken.length - afterToken.trimStart().length;
  const relation = /^(?:<=|>=|!=|=|<|>)/.exec(afterToken.trimStart());

  if (relation) {
    const rightStart = tokenEnd + spaces + relation[0].length;
    const rightSpaces =
      expression.slice(rightStart).length -
      expression.slice(rightStart).trimStart().length;
    const rightEnd = readSimpleMathToken(expression, rightStart + rightSpaces);
    return rightEnd > rightStart + rightSpaces ? rightEnd : -1;
  }

  return -1;
}

function readSingleMathSnippetEnd(expression: string, index: number) {
  const readers = [
    readCompactFunctionSnippetEnd,
    readFunctionSnippetEnd,
    readGroupedSnippetEnd,
    readTokenSnippetEnd,
  ];

  for (const reader of readers) {
    const end = reader(expression, index);
    if (end > index) return end;
  }

  return -1;
}

function skipSpaces(expression: string, index: number) {
  let current = index;

  while (expression[current] === " ") current++;

  return current;
}

function readOperatorChainEnd(expression: string, firstEnd: number) {
  let end = firstEnd;

  while (end < expression.length) {
    const operatorIndex = skipSpaces(expression, end);
    const operator = expression[operatorIndex];

    if (!["+", "-", "*", "/"].includes(operator)) {
      const implicitEnd = readSingleMathSnippetEnd(expression, operatorIndex);

      if (implicitEnd > operatorIndex) {
        end = implicitEnd;
        continue;
      }

      return end;
    }

    const nextStart = skipSpaces(expression, operatorIndex + 1);
    const nextEnd = readSingleMathSnippetEnd(expression, nextStart);

    if (nextEnd <= nextStart) return end;

    end = nextEnd;
  }

  return end;
}

function readMathSnippetEnd(expression: string, index: number) {
  const firstEnd = readSingleMathSnippetEnd(expression, index);

  if (firstEnd <= index) return -1;

  return readOperatorChainEnd(expression, firstEnd);
}

function splitMixedText(expression: string): Part[] {
  const parts: Part[] = [];
  let index = 0;
  let textStart = 0;

  while (index < expression.length) {
    const mathEnd = readMathSnippetEnd(expression, index);

    if (mathEnd > index) {
      if (index > textStart) {
        parts.push({ type: "text", value: expression.slice(textStart, index) });
      }

      parts.push({ type: "math", value: expression.slice(index, mathEnd) });
      index = mathEnd;
      textStart = index;
      continue;
    }

    index++;
  }

  if (textStart < expression.length) {
    parts.push({ type: "text", value: expression.slice(textStart) });
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
