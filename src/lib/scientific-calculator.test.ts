import { describe, expect, it } from 'vitest';
import { evaluateExpression, factorial } from './scientific-calculator';

describe('scientific calculator evaluator', () => {
  it('evaluates arithmetic with precedence', () => {
    expect(evaluateExpression('1 + 2 * 3')).toBe(7);
    expect(evaluateExpression('(1 + 2) * 3')).toBe(9);
  });

  it('handles functions, constants, and exponentiation', () => {
    expect(evaluateExpression('sqrt(9) + log(100) + ln(e)')).toBeCloseTo(6);
    expect(evaluateExpression('2^3^2')).toBe(512);
    expect(evaluateExpression('pow(2, 5)')).toBe(32);
  });

  it('supports degree mode for trigonometry', () => {
    expect(evaluateExpression('sin(30)', { angleMode: 'deg' })).toBeCloseTo(0.5);
    expect(evaluateExpression('asin(0.5)', { angleMode: 'deg' })).toBeCloseTo(30);
  });

  it('rejects non-math code instead of compiling it', () => {
    expect(() => evaluateExpression('constructor.constructor("alert(1)")()')).toThrow();
    expect(() => evaluateExpression('process.exit()')).toThrow();
  });

  it('calculates factorial within numeric bounds', () => {
    expect(factorial(0)).toBe(1);
    expect(factorial(5)).toBe(120);
    expect(() => factorial(171)).toThrow();
  });
});
