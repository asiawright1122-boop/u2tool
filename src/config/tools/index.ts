import { TEXT_TOOLS } from './text';
import { ENCODING_TOOLS } from './encoding';
import { GENERATORS_TOOLS } from './generators';
import { CONVERTERS_TOOLS } from './converters';
import { DEVELOPMENT_TOOLS } from './development';
import { SECURITY_TOOLS } from './security';
import { NETWORK_TOOLS } from './network';
import { IMAGE_TOOLS } from './image';
import { MATH_TOOLS } from './math';
import { CHARTS_TOOLS } from './charts';
import { OFFICE_TOOLS } from './office';
import { LIFESTYLE_TOOLS } from './lifestyle';
import { FINANCE_TOOLS } from './finance';
import { FUN_TOOLS } from './fun';
import type { Tool, ToolCategory } from './types';

export type { Tool, ToolCategory } from './types';
export { categories } from './categories';

export const tools: Tool[] = [
  ...TEXT_TOOLS,
  ...ENCODING_TOOLS,
  ...GENERATORS_TOOLS,
  ...CONVERTERS_TOOLS,
  ...DEVELOPMENT_TOOLS,
  ...SECURITY_TOOLS,
  ...NETWORK_TOOLS,
  ...IMAGE_TOOLS,
  ...MATH_TOOLS,
  ...CHARTS_TOOLS,
  ...OFFICE_TOOLS,
  ...LIFESTYLE_TOOLS,
  ...FINANCE_TOOLS,
  ...FUN_TOOLS,
];

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function getPopularTools(): Tool[] {
  return tools.filter((t) => t.popular);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}
