import type { InsertTemplate } from "./mathInsert";

export const templates = {
  log: { text: "log()", cursorOffset: 4 },
  sin: { text: "sin()", cursorOffset: 4 },
  cos: { text: "cos()", cursorOffset: 4 },
  tan: { text: "tan()", cursorOffset: 4 },
  ln:  { text: "ln()",  cursorOffset: 3 },
  fraction: { text: "()/()", cursorOffset: 1 },
  integral: { text: "integrate( , x)", cursorOffset: 10 },
  limit:    { text: "limit( , x, 0)", cursorOffset: 6 },
  power2:   { text: "^2", cursorOffset: 2 },
  powern:   { text: "^n", cursorOffset: 2 },
} satisfies Record<string, InsertTemplate>;