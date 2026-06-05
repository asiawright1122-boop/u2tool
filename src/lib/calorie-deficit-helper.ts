export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'extreme';
export type DeficitMode = 'value' | 'percent' | 'rate';

export interface CalorieDeficitInput {
  gender: Gender;
  weightKg: number;
  heightCm: number;
  ageYears: number;
  activityLevel: ActivityLevel;
  bodyFatPercent?: number;
  deficitMode: DeficitMode;
  deficitValue?: number; // absolute kcal
  deficitPercent?: number; // e.g. 20 means 20%
  weeklyRateGoalKg?: number; // e.g. 0.5 means 0.5kg/week
  weeklyRateGoalLbs?: number; // e.g. 1 means 1lb/week
}

export interface CalorieDeficitResult {
  bmr: number;
  tdee: number;
  deficit: number;
  targetIntake: number;
  weeklyWeightLossKg: number;
  weeklyWeightLossLbs: number;
  isSafe: boolean;
  safeLimit: number;
}

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  extreme: 1.9,
};

export function calculateBmr(input: {
  gender: Gender;
  weightKg: number;
  heightCm: number;
  ageYears: number;
  bodyFatPercent?: number;
}): number {
  const { gender, weightKg, heightCm, ageYears, bodyFatPercent } = input;

  // If body fat is provided and valid, use Katch-McArdle formula
  if (bodyFatPercent !== undefined && bodyFatPercent > 0 && bodyFatPercent < 100) {
    const lbm = weightKg * (1 - bodyFatPercent / 100);
    return 370 + 21.6 * lbm;
  }

  // Otherwise use Mifflin-St Jeor formula
  if (gender === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
  }
}

export function calculateTdee(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2;
  return bmr * multiplier;
}

export function calculateCalorieDeficit(input: CalorieDeficitInput): CalorieDeficitResult {
  const {
    gender,
    weightKg,
    heightCm,
    ageYears,
    activityLevel,
    bodyFatPercent,
    deficitMode,
    deficitValue = 0,
    deficitPercent = 0,
    weeklyRateGoalKg,
    weeklyRateGoalLbs,
  } = input;

  const bmr = calculateBmr({ gender, weightKg, heightCm, ageYears, bodyFatPercent });
  const tdee = calculateTdee(bmr, activityLevel);

  let deficit = 0;

  if (deficitMode === 'value') {
    deficit = deficitValue;
  } else if (deficitMode === 'percent') {
    deficit = tdee * (deficitPercent / 100);
  } else if (deficitMode === 'rate') {
    if (weeklyRateGoalKg !== undefined && weeklyRateGoalKg > 0) {
      // 1kg fat ≈ 7700 kcal. Daily deficit = (Goal * 7700) / 7 = Goal * 1100
      deficit = weeklyRateGoalKg * 1100;
    } else if (weeklyRateGoalLbs !== undefined && weeklyRateGoalLbs > 0) {
      // 1lb fat ≈ 3500 kcal. Daily deficit = (Goal * 3500) / 7 = Goal * 500
      deficit = weeklyRateGoalLbs * 500;
    }
  }

  // Ensure deficit is not negative
  deficit = Math.max(0, deficit);

  const calculatedIntake = tdee - deficit;
  const safeLimit = gender === 'male' ? 1500 : 1200;

  let targetIntake = calculatedIntake;
  let isSafe = true;

  if (calculatedIntake < safeLimit) {
    targetIntake = safeLimit;
    isSafe = false;
  }

  // Re-calculate the actual deficit taking into account safe limit clamping
  const actualDeficit = Math.max(0, tdee - targetIntake);

  // Estimate weight loss rate
  // 1kg = 7700 kcal, 1lb = 3500 kcal
  const weeklyWeightLossKg = (actualDeficit * 7) / 7700;
  const weeklyWeightLossLbs = (actualDeficit * 7) / 3500;

  return {
    bmr,
    tdee,
    deficit: actualDeficit,
    targetIntake,
    weeklyWeightLossKg,
    weeklyWeightLossLbs,
    isSafe,
    safeLimit,
  };
}
