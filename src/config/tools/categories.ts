import type { ToolCategory } from './types';

export const categories: { id: ToolCategory; icon: string }[] = [
  { id: 'text', icon: 'type' },
  { id: 'encoding', icon: 'binary' },
  { id: 'generators', icon: 'zap' },
  { id: 'converters', icon: 'arrow-left-right' },
  { id: 'development', icon: 'code-2' },
  { id: 'security', icon: 'shield-check' },
  { id: 'network', icon: 'globe' },
  { id: 'image', icon: 'image' },
  { id: 'math', icon: 'calculator' },
  { id: 'charts', icon: 'bar-chart-3' },
  { id: 'office', icon: 'file-text' },
  { id: 'lifestyle', icon: 'heart' },
  { id: 'finance', icon: 'wallet' },
  { id: 'fun', icon: 'gamepad-2' },
];
