import type { Tool } from './types';

export const FUN_TOOLS: Tool[] = [
  { slug: 'love-calculator', category: 'fun', icon: 'gamepad-2', component: 'LoveCalculator' },
  { slug: 'decision-wheel', category: 'fun', icon: 'gamepad-2', component: 'DecisionWheel' },
  { slug: 'name-generator', category: 'fun', icon: 'gamepad-2', component: 'NameGenerator' },
  { slug: 'random-picker', category: 'fun', icon: 'gamepad-2', component: 'RandomPicker' },
  { slug: 'coin-flipper', category: 'fun', icon: 'gamepad-2', component: 'CoinFlipper' },
  { slug: 'dice-roller', category: 'fun', icon: 'gamepad-2', component: 'DiceRoller' },
  { slug: 'team-generator', category: 'fun', icon: 'gamepad-2', component: 'TeamGenerator' },
  { slug: 'world-cup-simulator', category: 'fun', icon: 'gamepad-2', component: 'WorldCupSimulator' },
  { slug: 'world-cup-budget-calculator', category: 'fun', icon: 'gamepad-2', component: 'WorldCupBudgetCalculator' },
  { slug: 'world-cup-timezone-planner', category: 'fun', icon: 'calendar', component: 'WorldCupTimezonePlanner' },
  { slug: 'world-cup-visa-assistant', category: 'fun', icon: 'shield-alert', component: 'WorldCupVisaAssistant' },
  { slug: 'world-cup-group-calculator', category: 'fun', icon: 'trophy', component: 'WorldCupGroupCalculator' },
  { slug: 'world-cup-2026-bracket-predictor', category: 'fun', icon: 'trophy', component: 'WorldCup2026BracketPredictor', popular: true },
];
