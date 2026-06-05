import { describe, it, expect } from 'vitest';
import {
  calculateBmr,
  calculateTdee,
  calculateCalorieDeficit,
  type CalorieDeficitResult,
} from './calorie-deficit-helper';

describe('calculateBmr', () => {
  it('calculates BMR for male using Mifflin-St Jeor formula', () => {
    // 10 * 70 + 6.25 * 175 - 5 * 30 + 5 = 700 + 1093.75 - 150 + 5 = 1648.75
    const bmr = calculateBmr({ gender: 'male', weightKg: 70, heightCm: 175, ageYears: 30 });
    expect(bmr).toBeCloseTo(1648.75, 2);
  });

  it('calculates BMR for female using Mifflin-St Jeor formula', () => {
    // 10 * 60 + 6.25 * 165 - 5 * 25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25
    const bmr = calculateBmr({ gender: 'female', weightKg: 60, heightCm: 165, ageYears: 25 });
    expect(bmr).toBeCloseTo(1345.25, 2);
  });

  it('calculates BMR using Katch-McArdle formula when bodyFatPercent is provided', () => {
    // Lean Body Mass = 80 * (1 - 20/100) = 64 kg
    // BMR = 370 + 21.6 * 64 = 370 + 1382.4 = 1752.4
    const bmr = calculateBmr({
      gender: 'male',
      weightKg: 80,
      heightCm: 180,
      ageYears: 35,
      bodyFatPercent: 20,
    });
    expect(bmr).toBeCloseTo(1752.4, 2);
  });
});

describe('calculateTdee', () => {
  it('calculates TDEE for sedentary activity level', () => {
    const tdee = calculateTdee(1500, 'sedentary');
    expect(tdee).toBeCloseTo(1800, 2); // 1500 * 1.2
  });

  it('calculates TDEE for moderate activity level', () => {
    const tdee = calculateTdee(1500, 'moderate');
    expect(tdee).toBeCloseTo(2325, 2); // 1500 * 1.55
  });
});

describe('calculateCalorieDeficit', () => {
  it('calculates deficit by value and returns target intake and loss rate', () => {
    const result = calculateCalorieDeficit({
      gender: 'male',
      weightKg: 80,
      heightCm: 180,
      ageYears: 30,
      activityLevel: 'moderate',
      deficitMode: 'value',
      deficitValue: 500,
    });

    // Mifflin Male BMR: 10 * 80 + 6.25 * 180 - 5 * 30 + 5 = 800 + 1125 - 150 + 5 = 1780
    // Moderate TDEE: 1780 * 1.55 = 2759
    // Target Intake: 2759 - 500 = 2259
    // Weekly weight loss (kg): (500 * 7) / 7700 = 3500 / 7700 ≈ 0.45 kg
    expect(result.bmr).toBeCloseTo(1780, 2);
    expect(result.tdee).toBeCloseTo(2759, 2);
    expect(result.deficit).toBe(500);
    expect(result.targetIntake).toBeCloseTo(2259, 2);
    expect(result.weeklyWeightLossKg).toBeCloseTo(0.4545, 4);
    expect(result.weeklyWeightLossLbs).toBeCloseTo(1.0, 2); // (500 * 7) / 3500 = 1.0 lbs
    expect(result.isSafe).toBe(true);
  });

  it('calculates deficit by percentage of TDEE', () => {
    const result = calculateCalorieDeficit({
      gender: 'female',
      weightKg: 60,
      heightCm: 165,
      ageYears: 25,
      activityLevel: 'light',
      deficitMode: 'percent',
      deficitPercent: 20, // 20% deficit
    });

    // Female BMR: 10 * 60 + 6.25 * 165 - 5 * 25 - 161 = 1345.25
    // Light TDEE: 1345.25 * 1.375 = 1849.71875
    // Deficit: 1849.71875 * 0.2 ≈ 370
    // Target Intake: 1849.71875 - 370 ≈ 1479.7
    expect(result.tdee).toBeCloseTo(1849.72, 2);
    expect(result.deficit).toBeCloseTo(369.94, 2);
    expect(result.targetIntake).toBeCloseTo(1479.78, 2);
  });

  it('sets isSafe to false if intake falls below recommended threshold', () => {
    const result = calculateCalorieDeficit({
      gender: 'female',
      weightKg: 50,
      heightCm: 160,
      ageYears: 30,
      activityLevel: 'sedentary', // TDEE will be low
      deficitMode: 'value',
      deficitValue: 600, // Deficit too high, pushing intake below 1200 kcal limit
    });

    // Female BMR: 10 * 50 + 6.25 * 160 - 5 * 30 - 161 = 500 + 1000 - 150 - 161 = 1189
    // Sedentary TDEE: 1189 * 1.2 = 1426.8
    // Target Intake (Calculated): 1426.8 - 600 = 826.8
    // Recommended limit for female: 1200
    expect(result.targetIntake).toBeCloseTo(1200, 2); // Clamped to safe limit
    expect(result.isSafe).toBe(false); // Flagged as unsafe deficit
  });
});
