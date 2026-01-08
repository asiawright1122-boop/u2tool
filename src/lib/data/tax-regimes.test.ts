import { describe, it, expect } from 'vitest';
import { TAX_REGIMES, getDefaultCountryForLocale } from './tax-regimes';

describe('Tax Regimes Data Structures', () => {
  describe('getDefaultCountryForLocale', () => {
    it('should return correct country for each locale', () => {
      expect(getDefaultCountryForLocale('en')).toBe('US');
      expect(getDefaultCountryForLocale('zh')).toBe('CN');
      expect(getDefaultCountryForLocale('ja')).toBe('JP');
      expect(getDefaultCountryForLocale('ko')).toBe('KR');
      expect(getDefaultCountryForLocale('es')).toBe('ES');
      expect(getDefaultCountryForLocale('pt')).toBe('BR');
      expect(getDefaultCountryForLocale('fr')).toBe('FR');
      expect(getDefaultCountryForLocale('de')).toBe('DE');
      expect(getDefaultCountryForLocale('ru')).toBe('RU');
      expect(getDefaultCountryForLocale('ar')).toBe('SA');
    });

    it('should return US as default for unknown locale', () => {
      expect(getDefaultCountryForLocale('unknown')).toBe('US');
      expect(getDefaultCountryForLocale('')).toBe('US');
    });
  });

  describe('TAX_REGIMES data structure', () => {
    it('should have all 10 countries defined', () => {
      const expectedCountries = ['US', 'CN', 'JP', 'KR', 'ES', 'BR', 'FR', 'DE', 'RU', 'SA'];
      expectedCountries.forEach(code => {
        expect(TAX_REGIMES[code]).toBeDefined();
        expect(TAX_REGIMES[code].countryCode).toBe(code);
      });
    });

    it('should have required fields for each country', () => {
      Object.values(TAX_REGIMES).forEach(regime => {
        expect(regime.countryCode).toBeDefined();
        expect(regime.countryNameKey).toBeDefined();
        expect(regime.currency).toBeDefined();
        expect(regime.currencySymbol).toBeDefined();
        expect(regime.year).toBe(2024);
        expect(regime.filingStatuses).toBeDefined();
        expect(regime.filingStatuses.length).toBeGreaterThan(0);
        expect(regime.additionalDeductions).toBeDefined();
        expect(typeof regime.hasLocalTax).toBe('boolean');
      });
    });

    it('should have valid filing statuses for each country', () => {
      Object.values(TAX_REGIMES).forEach(regime => {
        regime.filingStatuses.forEach(status => {
          expect(status.id).toBeDefined();
          expect(status.nameKey).toBeDefined();
          expect(status.brackets).toBeDefined();
          expect(status.brackets.length).toBeGreaterThan(0);
          expect(typeof status.standardDeduction).toBe('number');
          expect(status.standardDeduction).toBeGreaterThanOrEqual(0);
        });
      });
    });

    it('should have valid tax brackets for each filing status', () => {
      Object.values(TAX_REGIMES).forEach(regime => {
        regime.filingStatuses.forEach(status => {
          status.brackets.forEach((bracket, index) => {
            expect(typeof bracket.min).toBe('number');
            expect(typeof bracket.max).toBe('number');
            expect(typeof bracket.rate).toBe('number');
            expect(bracket.min).toBeGreaterThanOrEqual(0);
            expect(bracket.max).toBeGreaterThan(bracket.min);
            expect(bracket.rate).toBeGreaterThanOrEqual(0);
            expect(bracket.rate).toBeLessThanOrEqual(100);

            // Check bracket continuity (no gaps)
            if (index > 0) {
              expect(bracket.min).toBe(status.brackets[index - 1].max);
            }
          });
        });
      });
    });

    it('should have valid currency codes', () => {
      const validCurrencies = ['USD', 'CNY', 'JPY', 'KRW', 'EUR', 'BRL', 'RUB', 'SAR'];
      Object.values(TAX_REGIMES).forEach(regime => {
        expect(validCurrencies).toContain(regime.currency);
      });
    });

    it('should have local tax rate when hasLocalTax is true', () => {
      Object.values(TAX_REGIMES).forEach(regime => {
        if (regime.hasLocalTax) {
          expect(regime.localTaxRate).toBeDefined();
          expect(regime.localTaxRate).toBeGreaterThan(0);
        }
      });
    });

    it('should have valid additional deductions structure', () => {
      Object.values(TAX_REGIMES).forEach(regime => {
        regime.additionalDeductions.forEach(deduction => {
          expect(deduction.id).toBeDefined();
          expect(deduction.nameKey).toBeDefined();
          expect(typeof deduction.amount).toBe('number');
          expect(deduction.amount).toBeGreaterThanOrEqual(0);
          expect(typeof deduction.optional).toBe('boolean');
        });
      });
    });
  });
});
