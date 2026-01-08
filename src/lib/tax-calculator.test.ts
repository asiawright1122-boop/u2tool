import { describe, it, expect } from 'vitest';
import { calculateTax, calculateProgressiveTax, calculateTotalDeductions } from './tax-calculator';
import { TAX_REGIMES } from './data/tax-regimes';

describe('Tax Calculator', () => {
  describe('calculateTotalDeductions', () => {
    it('should return standard deduction when no additional deductions', () => {
      const result = calculateTotalDeductions(14600, {}, []);
      expect(result).toBe(14600);
    });

    it('should add additional deductions to standard deduction', () => {
      const additionalDeductions = [
        { id: 'childEducation', nameKey: 'test', amount: 12000, optional: true },
        { id: 'housingLoan', nameKey: 'test', amount: 12000, optional: true },
      ];
      const result = calculateTotalDeductions(60000, { childEducation: 12000, housingLoan: 12000 }, additionalDeductions);
      expect(result).toBe(84000);
    });

    it('should ignore deductions not in available list', () => {
      const result = calculateTotalDeductions(14600, { unknown: 5000 }, []);
      expect(result).toBe(14600);
    });
  });

  describe('calculateProgressiveTax', () => {
    it('should calculate US tax correctly for single filer', () => {
      const brackets = TAX_REGIMES['US'].filingStatuses[0].brackets;
      
      // Test with $50,000 taxable income
      const result = calculateProgressiveTax(50000, brackets);
      
      // Expected: 10% on first $11,600 = $1,160
      // 12% on $11,600 to $47,150 = $4,266
      // 22% on $47,150 to $50,000 = $627
      // Total = $6,053
      expect(result.totalTax).toBeCloseTo(6053, 0);
      expect(result.bracketBreakdown.length).toBe(3);
    });

    it('should calculate China tax correctly using quick deduction method', () => {
      const brackets = TAX_REGIMES['CN'].filingStatuses[0].brackets;
      
      // Test with 100,000 CNY taxable income
      const result = calculateProgressiveTax(100000, brackets);
      
      // 100,000 falls in 36,000-144,000 bracket (10% rate, 2520 deduction)
      // Tax = 100,000 * 10% - 2,520 = 7,480
      expect(result.totalTax).toBeCloseTo(7480, 0);
    });

    it('should return zero tax for zero income', () => {
      const brackets = TAX_REGIMES['US'].filingStatuses[0].brackets;
      const result = calculateProgressiveTax(0, brackets);
      expect(result.totalTax).toBe(0);
      expect(result.bracketBreakdown.length).toBe(0);
    });

    it('should handle very high income', () => {
      const brackets = TAX_REGIMES['US'].filingStatuses[0].brackets;
      const result = calculateProgressiveTax(1000000, brackets);
      expect(result.totalTax).toBeGreaterThan(0);
      expect(result.bracketBreakdown.length).toBe(7); // All brackets used
    });
  });

  describe('calculateTax', () => {
    it('should calculate US tax correctly', () => {
      const regime = TAX_REGIMES['US'];
      const result = calculateTax(regime, 75000, 'single', {});
      
      expect(result.grossIncome).toBe(75000);
      expect(result.deductions).toBe(14600); // Standard deduction
      expect(result.taxableIncome).toBe(60400);
      expect(result.totalTax).toBeGreaterThan(0);
      expect(result.effectiveRate).toBeGreaterThan(0);
      expect(result.takeHomePay).toBeLessThan(75000);
      expect(result.localTax).toBeUndefined();
    });

    it('should calculate China tax with additional deductions', () => {
      const regime = TAX_REGIMES['CN'];
      const result = calculateTax(regime, 200000, 'individual', {
        childEducation: 12000,
        housingLoan: 12000,
      });
      
      expect(result.grossIncome).toBe(200000);
      expect(result.deductions).toBe(84000); // 60000 + 12000 + 12000
      expect(result.taxableIncome).toBe(116000);
      expect(result.totalTax).toBeGreaterThan(0);
    });

    it('should calculate Japan tax with local tax', () => {
      const regime = TAX_REGIMES['JP'];
      const result = calculateTax(regime, 5000000, 'individual', {});
      
      expect(result.grossIncome).toBe(5000000);
      expect(result.localTax).toBeDefined();
      expect(result.localTax).toBeGreaterThan(0);
      // Local tax should be 10% of taxable income
      expect(result.localTax).toBeCloseTo(result.taxableIncome * 0.1, 0);
    });

    it('should calculate Russia flat tax correctly', () => {
      const regime = TAX_REGIMES['RU'];
      const result = calculateTax(regime, 1000000, 'individual', {});
      
      // Russia has 13% flat tax
      expect(result.totalTax).toBeCloseTo(1000000 * 0.13, 0);
      expect(result.effectiveRate).toBeCloseTo(13, 1);
    });

    it('should calculate Saudi Arabia zero tax', () => {
      const regime = TAX_REGIMES['SA'];
      const result = calculateTax(regime, 500000, 'individual', {});
      
      expect(result.totalTax).toBe(0);
      expect(result.effectiveRate).toBe(0);
      expect(result.takeHomePay).toBe(500000);
    });

    it('should throw error for invalid filing status', () => {
      const regime = TAX_REGIMES['US'];
      expect(() => calculateTax(regime, 75000, 'invalid', {})).toThrow();
    });

    it('should handle zero income', () => {
      const regime = TAX_REGIMES['US'];
      const result = calculateTax(regime, 0, 'single', {});
      
      expect(result.grossIncome).toBe(0);
      expect(result.taxableIncome).toBe(0);
      expect(result.totalTax).toBe(0);
      expect(result.effectiveRate).toBe(0);
      expect(result.takeHomePay).toBe(0);
    });

    it('should handle income less than deduction', () => {
      const regime = TAX_REGIMES['US'];
      const result = calculateTax(regime, 10000, 'single', {});
      
      expect(result.grossIncome).toBe(10000);
      expect(result.taxableIncome).toBe(0); // Income < standard deduction
      expect(result.totalTax).toBe(0);
    });
  });

  describe('All countries calculation', () => {
    const testIncome = 100000;

    Object.entries(TAX_REGIMES).forEach(([code, regime]) => {
      it(`should calculate tax for ${code} without errors`, () => {
        const filingStatus = regime.filingStatuses[0];
        const result = calculateTax(regime, testIncome, filingStatus.id, {});
        
        expect(result.grossIncome).toBe(testIncome);
        expect(result.taxableIncome).toBeGreaterThanOrEqual(0);
        expect(result.totalTax).toBeGreaterThanOrEqual(0);
        expect(result.effectiveRate).toBeGreaterThanOrEqual(0);
        expect(result.effectiveRate).toBeLessThanOrEqual(100);
        expect(result.takeHomePay).toBeLessThanOrEqual(testIncome);
        expect(result.bracketBreakdown).toBeDefined();
      });
    });
  });
});
