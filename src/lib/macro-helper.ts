export type MacroRatioMode = 'balanced' | 'low-carb' | 'high-protein' | 'keto' | 'custom';

export interface MacroInput {
  targetCalories: number;
  ratioMode: MacroRatioMode;
  customCarbPercent?: number;
  customProteinPercent?: number;
  customFatPercent?: number;
}

export interface MacroResult {
  carbKcal: number;
  carbGrams: number;
  carbPercent: number;
  proteinKcal: number;
  proteinGrams: number;
  proteinPercent: number;
  fatKcal: number;
  fatGrams: number;
  fatPercent: number;
}

export const PRESET_RATIOS: Record<Exclude<MacroRatioMode, 'custom'>, { carb: number; protein: number; fat: number }> = {
  balanced: { carb: 50, protein: 20, fat: 30 },
  'low-carb': { carb: 25, protein: 35, fat: 40 },
  'high-protein': { carb: 40, protein: 30, fat: 30 },
  keto: { carb: 5, protein: 25, fat: 70 },
};

export function calculateMacros(input: MacroInput): MacroResult {
  const {
    targetCalories,
    ratioMode,
    customCarbPercent = 0,
    customProteinPercent = 0,
    customFatPercent = 0,
  } = input;

  const defaultResult: MacroResult = {
    carbKcal: 0,
    carbGrams: 0,
    carbPercent: 0,
    proteinKcal: 0,
    proteinGrams: 0,
    proteinPercent: 0,
    fatKcal: 0,
    fatGrams: 0,
    fatPercent: 0,
  };

  if (targetCalories <= 0) {
    return defaultResult;
  }

  let cPct = 0;
  let pPct = 0;
  let fPct = 0;

  if (ratioMode === 'custom') {
    const total = customCarbPercent + customProteinPercent + customFatPercent;
    if (total > 0) {
      // Normalize to 100%
      cPct = (customCarbPercent / total) * 100;
      pPct = (customProteinPercent / total) * 100;
      fPct = (customFatPercent / total) * 100;
    } else {
      // Fallback to balanced if custom inputs are invalid
      cPct = PRESET_RATIOS.balanced.carb;
      pPct = PRESET_RATIOS.balanced.protein;
      fPct = PRESET_RATIOS.balanced.fat;
    }
  } else {
    const preset = PRESET_RATIOS[ratioMode];
    cPct = preset.carb;
    pPct = preset.protein;
    fPct = preset.fat;
  }

  // Calculate calories contribution
  const carbKcal = targetCalories * (cPct / 100);
  const proteinKcal = targetCalories * (pPct / 100);
  const fatKcal = targetCalories * (fPct / 100);

  // Convert calories to grams: Carb=4 kcal/g, Protein=4 kcal/g, Fat=9 kcal/g
  const carbGrams = carbKcal / 4;
  const proteinGrams = proteinKcal / 4;
  const fatGrams = fatKcal / 9;

  return {
    carbKcal,
    carbGrams,
    carbPercent: cPct,
    proteinKcal,
    proteinGrams,
    proteinPercent: pPct,
    fatKcal,
    fatGrams,
    fatPercent: fPct,
  };
}
