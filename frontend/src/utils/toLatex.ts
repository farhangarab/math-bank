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

function splitTopLevel(value: string) {
  const parts: string[] = [];
  let depth = 0;
  let current = "";

  for (const char of value) {
    if (char === "(") depth++;
    if (char === ")") depth--;

    if (char === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  parts.push(current.trim());
  return parts;
}

function findClosing(input: string, openIndex: number) {
  const open = input[openIndex];
  const close = open === "(" ? ")" : open === "{" ? "}" : "";
  if (!close) return -1;

  let depth = 0;
  for (let index = openIndex; index < input.length; index++) {
    if (input[index] === open) depth++;
    if (input[index] === close) depth--;
    if (depth === 0) return index;
  }

  return -1;
}

function findOpening(input: string, closeIndex: number) {
  const close = input[closeIndex];
  const open = close === ")" ? "(" : close === "}" ? "{" : "";
  if (!open) return -1;

  let depth = 0;
  for (let index = closeIndex; index >= 0; index--) {
    if (input[index] === close) depth++;
    if (input[index] === open) depth--;
    if (depth === 0) return index;
  }

  return -1;
}

function normalizeInfinity(value: string) {
  const trimmed = value.trim();
  if (trimmed === "infinity" || trimmed === "inf") return "\\infty";
  return convertMath(trimmed);
}

function convertFunction(name: string, content: string) {
  const trimmed = content.trim();

  if (name === "sqrt") return `\\sqrt{${convertMath(trimmed)}}`;
  if (name === "sin") return `\\sin(${convertMath(trimmed)})`;
  if (name === "cos") return `\\cos(${convertMath(trimmed)})`;
  if (name === "tan") return `\\tan(${convertMath(trimmed)})`;
  if (name === "sec") return `\\sec(${convertMath(trimmed)})`;
  if (name === "csc") return `\\csc(${convertMath(trimmed)})`;
  if (name === "cot") return `\\cot(${convertMath(trimmed)})`;
  if (name === "ln") return `\\ln(${convertMath(trimmed)})`;
  if (name === "log") return `\\log(${convertMath(trimmed)})`;
  if (name === "exp") return `e^{${convertMath(trimmed)}}`;
  if (name === "abs") return `\\left|${convertMath(trimmed)}\\right|`;

  if (name === "sum") {
    if (!trimmed) return "\\sum";

    const [start, end, expression] = splitTopLevel(trimmed);
    const [variable, lower] = start.split("=").map((part) => part.trim());

    if (variable && lower && end && expression) {
      return `\\sum_{${variable}=${convertMath(lower)}}^{${convertMath(
        end,
      )}} ${convertMath(expression)}`;
    }

    return "\\sum";
  }

  if (name === "int") {
    if (!trimmed) return "\\int";

    const [expression, variable = "x"] = splitTopLevel(trimmed);
    return expression
      ? `\\int ${convertMath(expression)} \\, d${variable.trim() || "x"}`
      : "\\int";
  }

  if (name === "derivative") {
    if (!trimmed) return "\\frac{d}{dx}";

    const [expression, variable = "x"] = splitTopLevel(trimmed);
    return expression
      ? `\\frac{d}{d${variable.trim() || "x"}}\\left(${convertMath(
          expression,
        )}\\right)`
      : "\\frac{d}{dx}";
  }

  if (name === "lim" || name === "limit") {
    if (!trimmed) return "\\lim";

    const [variable, destination, expression] = splitTopLevel(trimmed);

    if (variable && destination && expression) {
      return `\\lim_{${variable} \\to ${normalizeInfinity(
        destination,
      )}} ${convertMath(expression)}`;
    }

    return "\\lim";
  }

  // Backward-compatible name from the previous toolbar.
  if (name === "integrate") {
    const [expression, variable = "x"] = splitTopLevel(trimmed);
    return expression ? `\\int ${convertMath(expression)} \\, d${variable}` : "\\int";
  }

  return `${name}(${content})`;
}

function convertFunctionCalls(input: string) {
  let output = "";
  let index = 0;

  while (index < input.length) {
    const name = FUNCTION_NAMES.find(
      (functionName) =>
        input.startsWith(functionName, index) &&
        !/[a-zA-Z\\]/.test(input[index - 1] ?? "") &&
        input[index + functionName.length] === "(",
    );

    if (!name) {
      output += input[index];
      index++;
      continue;
    }

    const openIndex = index + name.length;
    const closeIndex = findClosing(input, openIndex);

    if (closeIndex === -1) {
      output += input[index];
      index++;
      continue;
    }

    output += convertFunction(name, input.slice(openIndex + 1, closeIndex));
    index = closeIndex + 1;
  }

  return output;
}

function findCompactFunctionAt(input: string, index: number) {
  const blockedWord = COMPACT_WORD_BLOCKLIST.find(
    (word) =>
      input.startsWith(word, index) &&
      !/[a-zA-Z0-9]/.test(input[index + word.length] ?? ""),
  );

  if (blockedWord) return undefined;

  return COMPACT_FUNCTION_NAMES.find(
    (functionName) =>
      input.startsWith(functionName, index) &&
      !/[a-zA-Z\\]/.test(input[index - 1] ?? "") &&
      input[index + functionName.length] !== "(",
  );
}

function readCompactArgument(input: string, start: number) {
  if (/\d/.test(input[start] ?? "")) {
    let end = start;

    while (end < input.length && /[\d.]/.test(input[end])) end++;

    return { raw: input.slice(start, end), end };
  }

  if (!/[a-zA-Z]/.test(input[start] ?? "")) return null;

  let end = start;
  while (end < input.length && /[a-zA-Z0-9]/.test(input[end])) end++;

  const token = input.slice(start, end);
  const nestedFunction = COMPACT_FUNCTION_NAMES.find((name) =>
    token.startsWith(name),
  );

  // Keep this conservative so normal English words like "since" stay as text.
  if (
    token.length === 1 ||
    /^[a-zA-Z]\d+$/.test(token) ||
    COMPACT_CONSTANTS.includes(token) ||
    nestedFunction
  ) {
    return { raw: token, end };
  }

  return null;
}

function convertCompactFunctionCalls(input: string) {
  let output = "";
  let index = 0;

  while (index < input.length) {
    const name = findCompactFunctionAt(input, index);

    if (!name) {
      output += input[index];
      index++;
      continue;
    }

    const argument = readCompactArgument(input, index + name.length);

    if (!argument) {
      output += input[index];
      index++;
      continue;
    }

    // Supports common student shorthand such as logx, lnx, sin4, and sqrtx.
    output += convertFunction(name, argument.raw);
    index = argument.end;
  }

  return output;
}

function includeCommandBeforeGroup(input: string, start: number) {
  let commandStart = start;

  while (commandStart > 0 && /[a-zA-Z]/.test(input[commandStart - 1])) {
    commandStart--;
  }

  if (commandStart > 0 && input[commandStart - 1] === "\\") {
    return commandStart - 1;
  }

  return start;
}

function findLeftOperandStart(input: string, slashIndex: number) {
  let index = slashIndex - 1;
  while (index >= 0 && input[index] === " ") index--;

  if (input[index] === ")" || input[index] === "}") {
    const openIndex = findOpening(input, index);
    return openIndex === -1 ? index : includeCommandBeforeGroup(input, openIndex);
  }

  while (index >= 0 && /[a-zA-Z0-9\\]/.test(input[index])) index--;
  return index + 1;
}

function findRightOperandEnd(input: string, slashIndex: number) {
  let index = slashIndex + 1;
  while (index < input.length && input[index] === " ") index++;

  if (input[index] === "(" || input[index] === "{") {
    const closeIndex = findClosing(input, index);
    return closeIndex === -1 ? index + 1 : closeIndex + 1;
  }

  while (index < input.length && /[a-zA-Z0-9\\]/.test(input[index])) index++;

  if (input[index] === "(" || input[index] === "{") {
    const closeIndex = findClosing(input, index);
    return closeIndex === -1 ? index : closeIndex + 1;
  }

  return index;
}

function convertFractions(input: string): string {
  let output = input;

  while (true) {
    let slashIndex = -1;
    let depth = 0;

    for (let index = 0; index < output.length; index++) {
      if (output[index] === "(" || output[index] === "{") depth++;
      if (output[index] === ")" || output[index] === "}") depth--;
      if (output[index] === "/" && depth === 0) {
        slashIndex = index;
        break;
      }
    }

    if (slashIndex === -1) return output;

    const leftStart = findLeftOperandStart(output, slashIndex);
    const rightEnd = findRightOperandEnd(output, slashIndex);
    const numerator = output.slice(leftStart, slashIndex).trim();
    const denominator = output.slice(slashIndex + 1, rightEnd).trim();

    if (!numerator || !denominator) return output;

    output =
      output.slice(0, leftStart) +
      `\\frac{${convertMath(numerator)}}{${convertMath(denominator)}}` +
      output.slice(rightEnd);
  }
}

function readSimpleToken(input: string, start: number) {
  let index = start;
  while (index < input.length && /[a-zA-Z0-9]/.test(input[index])) index++;
  return { raw: input.slice(start, index), end: index };
}

function readLatexCommand(input: string, start: number) {
  let end = start + 1;
  while (end < input.length && /[a-zA-Z]/.test(input[end])) end++;

  if (input[end] === "(" || input[end] === "{") {
    const closeIndex = findClosing(input, end);
    if (closeIndex !== -1) end = closeIndex + 1;
  }

  return { raw: input.slice(start, end), end };
}

function readGroup(input: string, start: number) {
  const closeIndex = findClosing(input, start);
  const end = closeIndex === -1 ? start + 1 : closeIndex + 1;
  return { raw: input.slice(start, end), end };
}

function readPowerAtom(input: string, start: number) {
  if (input[start] === "\\") return readLatexCommand(input, start);
  if (input[start] === "(" || input[start] === "{") return readGroup(input, start);
  if (/[a-zA-Z0-9]/.test(input[start])) return readSimpleToken(input, start);
  return null;
}

function convertPowerAtom(raw: string) {
  if (raw.startsWith("(") && raw.endsWith(")")) {
    return `(${convertMath(raw.slice(1, -1))})`;
  }

  if (raw.startsWith("{") && raw.endsWith("}")) {
    return `{${convertMath(raw.slice(1, -1))}}`;
  }

  return raw;
}

function readExponent(input: string, start: number) {
  if (input[start] === "(" || input[start] === "{") {
    const group = readGroup(input, start);
    return {
      raw: group.raw.slice(1, -1),
      end: group.end,
    };
  }

  const token = readPowerAtom(input, start);
  return token ? { raw: token.raw, end: token.end } : null;
}

function buildRightAssociativePower(base: string, exponents: string[]) {
  let exponentLatex = convertMath(exponents[exponents.length - 1]);

  for (let index = exponents.length - 2; index >= 0; index--) {
    exponentLatex = `${convertMath(exponents[index])}^{${exponentLatex}}`;
  }

  return `${base}^{${exponentLatex}}`;
}

function convertPowers(input: string) {
  let output = "";
  let index = 0;

  while (index < input.length) {
    const atom = readPowerAtom(input, index);

    if (!atom || input[atom.end] !== "^") {
      output += input[index];
      index++;
      continue;
    }

    const exponents: string[] = [];
    let nextIndex = atom.end;

    while (input[nextIndex] === "^") {
      const exponent = readExponent(input, nextIndex + 1);
      if (!exponent) break;

      exponents.push(exponent.raw);
      nextIndex = exponent.end;
    }

    if (exponents.length === 0) {
      output += input[index];
      index++;
      continue;
    }

    output += buildRightAssociativePower(convertPowerAtom(atom.raw), exponents);
    index = nextIndex;
  }

  return output;
}

function convertMath(input: string): string {
  let output = input.trim();

  // Constants and common Greek variables.
  output = output.replace(/π/g, "\\pi");
  output = output.replace(/\bpi\b/g, "\\pi");
  output = output.replace(/\btheta\b/g, "\\theta");
  output = output.replace(/\balpha\b/g, "\\alpha");
  output = output.replace(/\bbeta\b/g, "\\beta");
  output = output.replace(/\binfinity\b/g, "\\infty");
  output = output.replace(/\binf\b/g, "\\infty");

  output = convertCompactFunctionCalls(output);
  output = convertFunctionCalls(output);
  output = convertFractions(output);
  output = convertPowers(output);

  // Relations and multiplication symbols students usually type.
  output = output.replace(/<=/g, "\\le ");
  output = output.replace(/>=/g, "\\ge ");
  output = output.replace(/!=/g, "\\ne ");
  output = output.replace(/\*/g, "\\cdot ");

  return output;
}

export function toLatex(input: string): string {
  if (!input) return "";

  return convertMath(input);
}
