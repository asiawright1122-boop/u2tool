/**
 * Translation Helper
 * 
 * 统一的翻译键查找工具函数，用于图表组件和其他工具组件
 * 
 * @module translation-helper
 */

/**
 * 获取工具特定的翻译文本
 * 
 * @param translations - 完整的翻译对象
 * @param toolSlug - 工具的 slug（如 'bar-chart-generator'）
 * @param key - 翻译键，支持点号分隔的嵌套键名（如 'tips.tip1', 'sampleData.monday'）
 * @param vars - 可选的变量替换对象（如 {count: 5} 会替换文本中的 {count}）
 * @returns 翻译后的文本，如果键不存在则返回 "MISSING: tools.{toolSlug}.{key}"
 * 
 * @example
 * ```typescript
 * // 简单键
 * const title = getToolTranslation(translations, 'bar-chart-generator', 'chartTitle');
 * 
 * // 嵌套键
 * const tip = getToolTranslation(translations, 'bar-chart-generator', 'tips.tip1');
 * 
 * // 带变量替换
 * const message = getToolTranslation(
 *   translations, 
 *   'bar-chart-generator', 
 *   'csvImportSuccess', 
 *   { count: 5 }
 * );
 * ```
 */
export function getToolTranslation(
  translations: Record<string, unknown>,
  toolSlug: string,
  key: string,
  vars?: Record<string, string | number>
): string {
  // 1. 获取 tools 命名空间
  const tools = (translations['tools'] as Record<string, unknown>) || {};
  
  // 2. 获取工具的翻译作用域
  const toolScope = (tools[toolSlug] as Record<string, unknown>) || {};
  
  // 3. 处理嵌套键名（如 'tips.tip1'）
  const keys = key.split('.');
  let value: unknown = toolScope;
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = (value as Record<string, unknown>)[k];
    } else {
      value = undefined;
      break;
    }
  }
  
  // 4. 检查是否找到有效的字符串值
  if (typeof value !== 'string') {
    return `MISSING: tools.${toolSlug}.${key}`;
  }
  
  // 5. 处理变量替换
  if (!vars) {
    return value;
  }
  
  let result = value;
  for (const [varKey, varValue] of Object.entries(vars)) {
    result = result.replace(`{${varKey}}`, String(varValue));
  }
  
  return result;
}

/**
 * 获取通用工具翻译（tools 命名空间下的通用键）
 * 
 * @param translations - 完整的翻译对象
 * @param key - 翻译键，支持点号分隔的嵌套键名（如 'copy', 'clear'）
 * @returns 翻译后的文本，如果键不存在则返回 "MISSING: tools.{key}"
 * 
 * @example
 * ```typescript
 * const copyText = getGeneralTranslation(translations, 'copy');
 * const clearText = getGeneralTranslation(translations, 'clear');
 * ```
 */
export function getGeneralTranslation(
  translations: Record<string, unknown>,
  key: string
): string {
  const tools = (translations['tools'] as Record<string, unknown>) || {};
  
  const keys = key.split('.');
  let value: unknown = tools;
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = (value as Record<string, unknown>)[k];
    } else {
      value = undefined;
      break;
    }
  }
  
  return typeof value === 'string' ? value : `MISSING: tools.${key}`;
}

/**
 * 创建工具特定的翻译函数（柯里化版本）
 * 
 * @param translations - 完整的翻译对象
 * @param toolSlug - 工具的 slug
 * @returns 返回一个翻译函数，可以直接使用键名获取翻译
 * 
 * @example
 * ```typescript
 * const t = createToolTranslator(translations, 'bar-chart-generator');
 * const title = t('chartTitle');
 * const tip = t('tips.tip1');
 * const message = t('csvImportSuccess', { count: 5 });
 * ```
 */
export function createToolTranslator(
  translations: Record<string, unknown>,
  toolSlug: string
): (key: string, vars?: Record<string, string | number>) => string {
  return (key: string, vars?: Record<string, string | number>) => {
    return getToolTranslation(translations, toolSlug, key, vars);
  };
}

/**
 * 创建通用翻译函数（柯里化版本）
 * 
 * @param translations - 完整的翻译对象
 * @returns 返回一个翻译函数，可以直接使用键名获取通用翻译
 * 
 * @example
 * ```typescript
 * const tg = createGeneralTranslator(translations);
 * const copyText = tg('copy');
 * const clearText = tg('clear');
 * ```
 */
export function createGeneralTranslator(
  translations: Record<string, unknown>
): (key: string) => string {
  return (key: string) => {
    return getGeneralTranslation(translations, key);
  };
}

/**
 * 批量获取翻译（用于性能优化）
 * 
 * @param translations - 完整的翻译对象
 * @param toolSlug - 工具的 slug
 * @param keys - 翻译键数组
 * @returns 返回键值对对象
 * 
 * @example
 * ```typescript
 * const texts = getBatchTranslations(
 *   translations, 
 *   'bar-chart-generator', 
 *   ['chartTitle', 'tips.tip1', 'tips.tip2']
 * );
 * // { chartTitle: '图表标题', 'tips.tip1': '提示1', 'tips.tip2': '提示2' }
 * ```
 */
export function getBatchTranslations(
  translations: Record<string, unknown>,
  toolSlug: string,
  keys: string[]
): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const key of keys) {
    result[key] = getToolTranslation(translations, toolSlug, key);
  }
  
  return result;
}

/**
 * 检查翻译键是否存在
 * 
 * @param translations - 完整的翻译对象
 * @param toolSlug - 工具的 slug
 * @param key - 翻译键
 * @returns 如果键存在返回 true，否则返回 false
 * 
 * @example
 * ```typescript
 * if (hasTranslation(translations, 'bar-chart-generator', 'chartTitle')) {
 *   // 键存在
 * }
 * ```
 */
export function hasTranslation(
  translations: Record<string, unknown>,
  toolSlug: string,
  key: string
): boolean {
  const tools = (translations['tools'] as Record<string, unknown>) || {};
  const toolScope = (tools[toolSlug] as Record<string, unknown>) || {};
  
  const keys = key.split('.');
  let value: unknown = toolScope;
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = (value as Record<string, unknown>)[k];
    } else {
      return false;
    }
  }
  
  return typeof value === 'string';
}
