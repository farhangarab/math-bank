export function toLatex(input: string): string {
  if (!input) return "";

  let out = input;

  out = out.replace(/([a-zA-Z0-9\]]|\))\^([0-9]+|[a-zA-Z])/g, "$1^{$2}");
  out = out.replace(/sqrt\((.*?)\)/g, "\\sqrt{$1}");
  out = out.replace(
    /integrate\((.+?)\s*,\s*([a-zA-Z])\)/g,
    (_, expr, variable) => `\\int ${expr} \\, d${variable}`
  );
  out = out.replace(
    /limit\((.+?),\s*([a-zA-Z]),\s*(.+?)\)/g,
    "\\lim_{$2 \\to $3} $1"
  );
  out = out.replace(/\bsin\(([^)]*)\)/g, "\\sin($1)");
  out = out.replace(/\bcos\(([^)]*)\)/g, "\\cos($1)");
  out = out.replace(/\btan\(([^)]*)\)/g, "\\tan($1)");
  out = out.replace(/\blog\(([^)]*)\)/g, "\\log($1)");
  out = out.replace(/\bln\(([^)]*)\)/g,  "\\ln($1)");
  out = out.replace(/\bpi\b/g, "\\pi");

  return out;
}
