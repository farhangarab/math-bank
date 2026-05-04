import type { InsertTemplate } from "./mathInsert";

export const templates = {
  sqrt: { text: "sqrt()", cursorOffset: 5 },
  log: { text: "log()", cursorOffset: 4 },
  exp: { text: "exp()", cursorOffset: 4 },
  abs: { text: "abs()", cursorOffset: 4 },
  sin: { text: "sin()", cursorOffset: 4 },
  cos: { text: "cos()", cursorOffset: 4 },
  tan: { text: "tan()", cursorOffset: 4 },
  sec: { text: "sec()", cursorOffset: 4 },
  csc: { text: "csc()", cursorOffset: 4 },
  cot: { text: "cot()", cursorOffset: 4 },
  ln: { text: "ln()", cursorOffset: 3 },
  fraction: { text: "()/()", cursorOffset: 1 },
  integral: { text: "int()", cursorOffset: 4 },
  derivative: { text: "d/dx", cursorOffset: 4 },
  limit: { text: "lim()", cursorOffset: 4 },
  sum: { text: "sum()", cursorOffset: 5 },
  power2: { text: "^2", cursorOffset: 2 },
  powern: { text: "^()", cursorOffset: 2 },
} satisfies Record<string, InsertTemplate>;
