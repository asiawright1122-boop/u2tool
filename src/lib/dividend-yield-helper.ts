export interface DividendInput {
  annualDividend?: number;
  quarterlyDividend?: number;
  monthlyDividend?: number;
}

export interface DividendYieldInput {
  annualDividend?: number;
  quarterlyDividend?: number;
  monthlyDividend?: number;
  sharePrice: number;
  sharesHeld?: number;
  targetAnnualIncome?: number;
}

export interface DividendYieldResult {
  yieldPercent: number;
  annualDividend: number;
  annualIncome?: number;
  monthlyIncome?: number;
  sharesNeeded?: number;
  capitalNeeded?: number;
}

export function calculateAnnualDividend(input: DividendInput): number {
  if (input.annualDividend !== undefined) {
    return input.annualDividend;
  }
  if (input.quarterlyDividend !== undefined) {
    return input.quarterlyDividend * 4;
  }
  if (input.monthlyDividend !== undefined) {
    return input.monthlyDividend * 12;
  }
  return 0;
}

export function calculateSharePrice(input: { annualDividend: number; yieldPercent: number }): number {
  if (input.yieldPercent <= 0) return 0;
  return (input.annualDividend / input.yieldPercent) * 100;
}

export function classifyYield(yieldPercent: number): 'very-low' | 'low' | 'moderate' | 'high' | 'very-high' {
  if (yieldPercent < 1) return 'very-low';
  if (yieldPercent < 2) return 'low';
  if (yieldPercent < 5) return 'moderate';
  if (yieldPercent < 10) return 'high';
  return 'very-high';
}

export function calculateDividendYield(input: DividendYieldInput): DividendYieldResult {
  const { sharePrice, sharesHeld, targetAnnualIncome } = input;
  const annualDividend = calculateAnnualDividend(input);

  if (sharePrice <= 0) {
    return {
      yieldPercent: 0,
      annualDividend,
      annualIncome: 0,
      monthlyIncome: 0,
      sharesNeeded: 0,
      capitalNeeded: 0,
    };
  }

  const yieldPercent = (annualDividend / sharePrice) * 100;

  const result: DividendYieldResult = {
    yieldPercent,
    annualDividend,
  };

  const effectiveShares = sharesHeld !== undefined ? sharesHeld : 1;
  result.annualIncome = effectiveShares * annualDividend;
  result.monthlyIncome = result.annualIncome / 12;

  if (targetAnnualIncome !== undefined) {
    if (annualDividend > 0) {
      result.sharesNeeded = Math.ceil(targetAnnualIncome / annualDividend);
      result.capitalNeeded = result.sharesNeeded * sharePrice;
    } else {
      result.sharesNeeded = 0;
      result.capitalNeeded = 0;
    }
  }

  return result;
}
