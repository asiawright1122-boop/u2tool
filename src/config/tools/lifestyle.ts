import type { Tool } from './types';

export const LIFESTYLE_TOOLS: Tool[] = [
  { slug: 'calorie-calculator', category: 'lifestyle', icon: 'heart', component: 'CalorieCalculator' },
  { slug: 'water-intake-calculator', category: 'lifestyle', icon: 'heart', component: 'WaterIntakeCalculator' },
  { slug: 'sleep-calculator', category: 'lifestyle', icon: 'heart', component: 'SleepCalculator' },
  { slug: 'due-date-calculator', category: 'lifestyle', icon: 'heart', component: 'DueDateCalculator' },
  { slug: 'countdown-days-calculator', category: 'lifestyle', icon: 'heart', component: 'CountdownDaysCalculator', popular: true },
  { slug: 'fuel-cost-calculator', category: 'lifestyle', icon: 'heart', component: 'FuelCostCalculator' },
  { slug: 'electricity-cost-calculator', category: 'lifestyle', icon: 'heart', component: 'ElectricityCostCalculator' },
  { slug: 'pace-calculator', category: 'lifestyle', icon: 'heart', component: 'PaceCalculator' },
  { slug: 'carbon-footprint-calculator', category: 'lifestyle', icon: 'heart', component: 'CarbonFootprintCalculator' },
  { slug: 'habit-tracker', category: 'lifestyle', icon: 'heart', component: 'HabitTracker' },
  { slug: 'calorie-deficit-calculator', category: 'lifestyle', icon: 'calculator', component: 'CalorieDeficitCalculator', popular: true },
  { slug: 'macro-calculator', category: 'lifestyle', icon: 'calculator', component: 'MacroCalculator', popular: true },
  { slug: 'one-rep-max-calculator', category: 'lifestyle', icon: 'activity', component: 'OneRepMaxCalculator', popular: true },
];
