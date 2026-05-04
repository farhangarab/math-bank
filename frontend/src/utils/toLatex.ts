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

function convertNamedFunction(
  input: string,
  name: string,
  buildLatex: (content: string) => string,
) {
  return input.replace(new RegExp(`\\b${name}\\(([^()]*)\\)`, "g"), (_, content) =>
    buildLatex(content.trim()),
  );
}

export function toLatex(input: string): string {
  if (!input) return "";

  let out = input;

  // Constants and common Greek variables.
  out = out.replace(/π/g, "\\pi");
  out = out.replace(/\bpi\b/g, "\\pi");
  out = out.replace(/\btheta\b/g, "\\theta");
  out = out.replace(/\balpha\b/g, "\\alpha");
  out = out.replace(/\bbeta\b/g, "\\beta");

  // Relations and multiplication symbols students usually type.
  out = out.replace(/<=/g, "\\le ");
  out = out.replace(/>=/g, "\\ge ");
  out = out.replace(/!=/g, "\\ne ");
  out = out.replace(/\*/g, "\\cdot ");

  // Parenthesized and simple fractions. This intentionally stays lightweight.
  out = out.replace(/\(([^()]+)\)\/\(([^()]+)\)/g, "\\frac{$1}{$2}");
  out = out.replace(
    /\b([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)\b/g,
    "\\frac{$1}{$2}",
  );

  // Powers like x^2 and x^(n).
  out = out.replace(/([a-zA-Z0-9\\]+|\([^()]+\))\^\(([^()]*)\)/g, "$1^{$2}");
  out = out.replace(/([a-zA-Z0-9\\]+|\([^()]+\))\^([a-zA-Z0-9]+)/g, "$1^{$2}");

  // Roots and standard functions. Empty parentheses are safe while typing.
  out = convertNamedFunction(out, "sqrt", (content) => `\\sqrt{${content}}`);
  out = convertNamedFunction(out, "sin", (content) => `\\sin(${content})`);
  out = convertNamedFunction(out, "cos", (content) => `\\cos(${content})`);
  out = convertNamedFunction(out, "tan", (content) => `\\tan(${content})`);
  out = convertNamedFunction(out, "sec", (content) => `\\sec(${content})`);
  out = convertNamedFunction(out, "csc", (content) => `\\csc(${content})`);
  out = convertNamedFunction(out, "cot", (content) => `\\cot(${content})`);
  out = convertNamedFunction(out, "ln", (content) => `\\ln(${content})`);
  out = convertNamedFunction(out, "log", (content) => `\\log(${content})`);
  out = convertNamedFunction(out, "exp", (content) => `e^{${content}}`);
  out = convertNamedFunction(out, "abs", (content) => `\\left|${content}\\right|`);

  // Calculus helpers. Rich forms are supported only when the text is simple.
  out = convertNamedFunction(out, "sum", (content) => {
    if (!content) return "\\sum";

    const [start, end, expression] = splitTopLevel(content);
    const [variable, lower] = start.split("=").map((part) => part.trim());

    if (variable && lower && end && expression) {
      return `\\sum_{${variable}=${lower}}^{${end}} ${expression}`;
    }

    return "\\sum";
  });

  out = convertNamedFunction(out, "int", (content) =>
    content ? `\\int ${content} \\, dx` : "\\int",
  );

  out = convertNamedFunction(out, "lim", (content) => {
    if (!content) return "\\lim";

    const [variable, destination, expression] = splitTopLevel(content);

    if (variable && destination && expression) {
      return `\\lim_{${variable} \\to ${destination}} ${expression}`;
    }

    return "\\lim";
  });

  // Backward-compatible names from the previous toolbar.
  out = convertNamedFunction(out, "integrate", (content) => {
    const [expression, variable = "x"] = splitTopLevel(content);
    return expression ? `\\int ${expression} \\, d${variable}` : "\\int";
  });
  out = convertNamedFunction(out, "limit", (content) => {
    const [expression, variable = "x", destination = "0"] = splitTopLevel(content);
    return expression ? `\\lim_{${variable} \\to ${destination}} ${expression}` : "\\lim";
  });

  return out;
}
