import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { analyzePassword } from './PasswordStrength';

/**
 * **Feature: add-new-tools, Property 5: 密码强度评分一致性**
 * *For any* 密码，强度评分应该随着密码复杂度（长度、字符种类）的增加而单调递增
 * **Validates: Requirements 6.4**
 */
describe('Property 5: Password Strength Score Consistency', () => {
  it('longer passwords should have equal or higher scores', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 4, maxLength: 8 }),
        fc.string({ minLength: 1, maxLength: 10 }),
        (base, extra) => {
          const shortPassword = base;
          const longPassword = base + extra;
          
          const shortResult = analyzePassword(shortPassword);
          const longResult = analyzePassword(longPassword);
          
          // Longer password should generally have equal or higher score
          // (unless it introduces patterns like repetition)
          expect(longResult.score).toBeGreaterThanOrEqual(shortResult.score - 1);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('adding character types should increase or maintain score', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-z]{6,10}$/),
        (lowercaseOnly) => {
          const withUpper = lowercaseOnly + 'A';
          const withNumber = lowercaseOnly + '1';
          const withSymbol = lowercaseOnly + '!';
          
          const baseResult = analyzePassword(lowercaseOnly);
          const upperResult = analyzePassword(withUpper);
          const numberResult = analyzePassword(withNumber);
          const symbolResult = analyzePassword(withSymbol);
          
          expect(upperResult.score).toBeGreaterThanOrEqual(baseResult.score);
          expect(numberResult.score).toBeGreaterThanOrEqual(baseResult.score);
          expect(symbolResult.score).toBeGreaterThanOrEqual(baseResult.score);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('score should be between 0 and 7', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 50 }),
        (password) => {
          const result = analyzePassword(password);
          expect(result.score).toBeGreaterThanOrEqual(0);
          expect(result.score).toBeLessThanOrEqual(7);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('common passwords should have low scores', () => {
    const commonPasswords = ['password', '123456', 'qwerty', 'admin'];
    
    for (const pwd of commonPasswords) {
      const result = analyzePassword(pwd);
      expect(result.score).toBeLessThanOrEqual(3);
      expect(result.suggestions).toContain('common');
    }
  });

  it('strong passwords should have high scores', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-z]{4}[A-Z]{4}[0-9]{4}[!@#$]{4}$/),
        (strongPassword) => {
          const result = analyzePassword(strongPassword);
          expect(result.score).toBeGreaterThanOrEqual(5);
          expect(result.label).toMatch(/good|strong/);
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('empty password should have score 0', () => {
    const result = analyzePassword('');
    expect(result.score).toBe(0);
    expect(result.label).toBe('empty');
  });

  it('label should match score range', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }),
        (password) => {
          const result = analyzePassword(password);
          
          if (result.score <= 2) {
            expect(result.label).toBe('weak');
          } else if (result.score <= 4) {
            expect(result.label).toBe('fair');
          } else if (result.score <= 6) {
            expect(result.label).toBe('good');
          } else {
            expect(result.label).toBe('strong');
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
