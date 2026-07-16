const FORMULA_LEADING_CELL = /^'*[\s\u0000-\u001f\u007f-\u009f]*[=+\-@]/u;

export function neutralizeCsvFormula(value: string): string {
  return FORMULA_LEADING_CELL.test(value) ? `'${value}` : value;
}

export function removeCsvFormulaSafetyLayer(value: string): string {
  if (!value.startsWith("'")) return value;
  const unwrapped = value.slice(1);
  return FORMULA_LEADING_CELL.test(unwrapped) ? unwrapped : value;
}
