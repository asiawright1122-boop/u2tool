export interface OneRepMaxInput {
  weight: number;
  reps: number;
}

export interface OneRepMaxResult {
  epleyMax: number;
  brzyckiMax: number;
  averageMax: number;
}

export interface LoadEntry {
  percentage: number;
  weight: number;
  recommendedReps: number;
}

export function calculateOneRepMax(input: OneRepMaxInput): OneRepMaxResult {
  const { weight, reps } = input;

  if (weight <= 0 || reps <= 0) {
    return { epleyMax: 0, brzyckiMax: 0, averageMax: 0 };
  }

  if (reps === 1) {
    return { epleyMax: weight, brzyckiMax: weight, averageMax: weight };
  }

  // Epley formula: 1RM = w * (1 + r / 30)
  const epleyMax = weight * (1 + reps / 30);

  // Brzycki formula: 1RM = w / (1.0278 - 0.0278 * r)
  // Avoid division by zero if reps is too high (though reps should be <= 10 or 12 for accuracy)
  const brzyckiDenom = 1.0278 - 0.0278 * reps;
  const brzyckiMax = brzyckiDenom > 0 ? weight / brzyckiDenom : epleyMax;

  const averageMax = (epleyMax + brzyckiMax) / 2;

  return {
    epleyMax,
    brzyckiMax,
    averageMax,
  };
}

const REPS_LOOKUP: Record<number, number> = {
  95: 2,
  90: 3,
  85: 6,
  80: 8,
  75: 10,
  70: 12,
  65: 15,
  60: 20,
  55: 25,
  50: 30,
};

export function generateLoadTable(oneRepMax: number): LoadEntry[] {
  if (oneRepMax <= 0) return [];

  // Generate 50% to 95% at 5% steps
  const percentages = [95, 90, 85, 80, 75, 70, 65, 60, 55, 50];

  return percentages.map(pct => {
    const weight = oneRepMax * (pct / 100);
    const recommendedReps = REPS_LOOKUP[pct] ?? Math.round(30 * (100 / pct - 1));
    return {
      percentage: pct,
      weight,
      recommendedReps,
    };
  });
}
