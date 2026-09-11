import type { Tool } from './types';

export const FUN_TOOLS: Tool[] = [
  { slug: 'love-calculator', category: 'fun', icon: 'gamepad-2', component: 'LoveCalculator', popular: true },
  { slug: 'decision-wheel', category: 'fun', icon: 'gamepad-2', component: 'DecisionWheel', popular: true },
  { slug: 'name-generator', category: 'fun', icon: 'gamepad-2', component: 'NameGenerator' },
  { slug: 'random-picker', category: 'fun', icon: 'gamepad-2', component: 'RandomPicker' },
  { slug: 'coin-flipper', category: 'fun', icon: 'gamepad-2', component: 'CoinFlipper' },
  { slug: 'dice-roller', category: 'fun', icon: 'gamepad-2', component: 'DiceRoller', popular: true },
  { slug: 'team-generator', category: 'fun', icon: 'gamepad-2', component: 'TeamGenerator', popular: true },
];
