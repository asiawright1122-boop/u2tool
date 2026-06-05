import { describe, it, expect } from 'vitest';
import {
  calculateMacros,
  type MacroResult,
} from './macro-helper';

describe('calculateMacros', () => {
  it('calculates macros for balanced ratio (50/20/30)', () => {
    // 2000 kcal
    // Carb: 2000 * 0.50 = 1000 kcal -> 1000 / 4 = 250g
    // Protein: 2000 * 0.20 = 400 kcal -> 400 / 4 = 100g
    // Fat: 2000 * 0.30 = 600 kcal -> 600 / 9 ≈ 66.67g
    const result = calculateMacros({ targetCalories: 2000, ratioMode: 'balanced' });
    expect(result.carbKcal).toBeCloseTo(1000, 2);
    expect(result.carbGrams).toBeCloseTo(250, 2);
    expect(result.proteinKcal).toBeCloseTo(400, 2);
    expect(result.proteinGrams).toBeCloseTo(100, 2);
    expect(result.fatKcal).toBeCloseTo(600, 2);
    expect(result.fatGrams).toBeCloseTo(66.67, 2);
    expect(result.carbPercent).toBe(50);
    expect(result.proteinPercent).toBe(20);
    expect(result.fatPercent).toBe(30);
  });

  it('calculates macros for keto ratio (5/25/70)', () => {
    // 1500 kcal
    // Carb: 1500 * 0.05 = 75 kcal -> 75 / 4 = 18.75g
    // Protein: 1500 * 0.25 = 375 kcal -> 375 / 4 = 93.75g
    // Fat: 1500 * 0.70 = 1050 kcal -> 1050 / 9 ≈ 116.67g
    const result = calculateMacros({ targetCalories: 1500, ratioMode: 'keto' });
    expect(result.carbGrams).toBeCloseTo(18.75, 2);
    expect(result.proteinGrams).toBeCloseTo(93.75, 2);
    expect(result.fatGrams).toBeCloseTo(116.67, 2);
  });

  it('calculates macros for custom ratio', () => {
    // 2500 kcal, custom ratio 45/25/30
    // Carb: 2500 * 0.45 = 1125 kcal -> 1125 / 4 = 281.25g
    // Protein: 2500 * 0.25 = 625 kcal -> 625 / 4 = 156.25g
    // Fat: 2500 * 0.30 = 750 kcal -> 750 / 9 ≈ 83.33g
    const result = calculateMacros({
      targetCalories: 2500,
      ratioMode: 'custom',
      customCarbPercent: 45,
      customProteinPercent: 25,
      customFatPercent: 30,
    });
    expect(result.carbGrams).toBeCloseTo(281.25, 2);
    expect(result.proteinGrams).toBeCloseTo(156.25, 2);
    expect(result.fatGrams).toBeCloseTo(83.33, 2);
  });

  it('normalizes custom percentages if they do not sum to 100%', () => {
    // 2000 kcal, custom ratio 40/30/20 (sums to 90%, should normalize to 44.44%, 33.33%, 22.22%)
    const result = calculateMacros({
      targetCalories: 2000,
      ratioMode: 'custom',
      customCarbPercent: 40,
      customProteinPercent: 30,
      customFatPercent: 20,
    });
    expect(result.carbPercent + result.proteinPercent + result.fatPercent).toBeCloseTo(100, 2);
  });

  it('handles zero or negative calories gracefully', () => {
    const result = calculateMacros({ targetCalories: -100, ratioMode: 'balanced' });
    expect(result.carbGrams).toBe(0);
    expect(result.proteinGrams).toBe(0);
    expect(result.fatGrams).toBe(0);
  });
});
