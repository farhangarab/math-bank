export type ValidationRule = {
  field: string;
  message: string;
  isValid: boolean;
};

export function firstInvalid(rules: ValidationRule[]) {
  return rules.find((rule) => !rule.isValid);
}
