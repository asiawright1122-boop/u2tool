/**
 * Tax Calculator Engine
 * 
 * Core calculation functions for computing taxes based on different
 * country tax regimes.
 */

import type { TaxRegime, TaxBracket, TaxResult, Deduction } from './data/tax-regimes';

/**
 * Calculate total deductions including standard and additional deductions
 */
export function calculateTotalDeductions(
  standardDeduction: number,
  additionalDeductions: Record<string, number>,
  availableDeductions: Deduction[]
): number {
  let total = standardDeduction;
  
  // Add selected additional deductions
  for (const [id, amount] of Object.entries(additionalDeductions)) {
    const deduction = availableDeductions.find(d => d.id === id);
    if (deduction && amount > 0) {
      total += amount;
    }
  }
  
  return total;
}

/**
 * Calculate progressive tax based on tax brackets
 * Supports both standard progressive calculation and quick deduction method (used in China)
 */
export function calculateProgressiveTax(
  taxableIncome: number,
  brackets: TaxBracket[]
): { totalTax: number; bracketBreakdown: TaxResult['bracketBreakdown'] } {
  let totalTax = 0;
  const bracketBreakdown: TaxResult['bracketBreakdown'] = [];
  
  // Check if brackets use quick deduction method (has deduction field)
  const usesQuickDeduction = brackets.some(b => b.deduction !== undefined);
  
  if (usesQuickDeduction) {
    // Quick deduction method (used in China)
    // Tax = Taxable Income × Rate - Quick Deduction
    for (const bracket of brackets) {
      if (taxableIncome > bracket.min && taxableIncome <= bracket.max) {
        const taxInBracket = taxableIncome * (bracket.rate / 100) - (bracket.deduction || 0);
        totalTax = Math.max(0, taxInBracket);
        
        bracketBreakdown.push({
          bracket,
          taxableInBracket: taxableIncome,
          taxInBracket: totalTax,
        });
        break;
      }
    }
  } else {
    // Standard progressive calculation
    for (const bracket of brackets) {
      if (taxableIncome > bracket.min) {
        const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
        const taxInBracket = taxableInBracket * (bracket.rate / 100);
        
        totalTax += taxInBracket;
        bracketBreakdown.push({
          bracket,
          taxableInBracket,
          taxInBracket,
        });
        
        // Stop if we've reached the bracket containing the taxable income
        if (taxableIncome <= bracket.max) {
          break;
        }
      }
    }
  }
  
  return { totalTax, bracketBreakdown };
}

/**
 * Main tax calculation function
 * Calculates tax based on a country's tax regime
 */
export function calculateTax(
  regime: TaxRegime,
  grossIncome: number,
  filingStatusId: string,
  additionalDeductions: Record<string, number> = {}
): TaxResult {
  // Find the filing status
  const filingStatus = regime.filingStatuses.find(s => s.id === filingStatusId);
  if (!filingStatus) {
    throw new Error(`Filing status ${filingStatusId} not found for country ${regime.countryCode}`);
  }
  
  // Calculate total deductions
  const totalDeductions = calculateTotalDeductions(
    filingStatus.standardDeduction,
    additionalDeductions,
    regime.additionalDeductions
  );
  
  // Calculate taxable income
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  
  // Calculate progressive tax
  const { totalTax, bracketBreakdown } = calculateProgressiveTax(
    taxableIncome,
    filingStatus.brackets
  );
  
  // Calculate local tax if applicable
  const localTax = regime.hasLocalTax && regime.localTaxRate
    ? taxableIncome * (regime.localTaxRate / 100)
    : undefined;
  
  // Calculate effective rate and take-home pay
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
  const takeHomePay = grossIncome - totalTax - (localTax || 0);
  
  return {
    grossIncome,
    deductions: totalDeductions,
    taxableIncome,
    totalTax,
    localTax,
    effectiveRate,
    takeHomePay,
    bracketBreakdown,
  };
}
